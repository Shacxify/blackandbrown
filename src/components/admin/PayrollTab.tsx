import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { displayName, type ManagedUser } from './EmployeesTab';

interface PayrollEntry {
  id: string;
  employee_id: string;
  period_start: string;
  period_end: string;
  hours_worked: number;
  hourly_rate: number;
  gross_pay: number;
  paid: boolean;
  paid_at: string | null;
  notes: string | null;
}

interface Props {
  employees: ManagedUser[];
}

const PayrollTab = ({ employees }: Props) => {
  const [entries, setEntries] = useState<PayrollEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [hours, setHours] = useState('');
  const [rate, setRate] = useState('');
  const [notes, setNotes] = useState('');

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payroll_entries')
      .select('*')
      .order('period_end', { ascending: false });
    if (error) toast.error(error.message);
    else setEntries((data as PayrollEntry[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const employeeName = (id: string) => {
    const u = employees.find((e) => e.id === id);
    return u ? displayName(u) : id.slice(0, 8);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(hours);
    const r = parseFloat(rate);
    if (!employeeId || !periodStart || !periodEnd || isNaN(h) || isNaN(r)) {
      toast.error('Fill all required fields');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('payroll_entries').insert({
      employee_id: employeeId,
      period_start: periodStart,
      period_end: periodEnd,
      hours_worked: h,
      hourly_rate: r,
      gross_pay: +(h * r).toFixed(2),
      notes: notes || null,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Payroll entry added');
    setHours(''); setRate(''); setNotes(''); setPeriodStart(''); setPeriodEnd('');
    load();
  };

  const markPaid = async (id: string, paid: boolean) => {
    const { error } = await supabase
      .from('payroll_entries')
      .update({ paid, paid_at: paid ? new Date().toISOString() : null })
      .eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success(paid ? 'Marked paid' : 'Marked unpaid'); load(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this payroll entry?')) return;
    const { error } = await supabase.from('payroll_entries').delete().eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Removed'); load(); }
  };

  const totalUnpaid = entries
    .filter((e) => !e.paid)
    .reduce((sum, e) => sum + Number(e.gross_pay), 0);

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
            New Payroll Entry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label className="text-xs tracking-wide uppercase">Employee</Label>
              <Select value={employeeId} onValueChange={setEmployeeId}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select employee" /></SelectTrigger>
                <SelectContent>
                  {employees.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{displayName(u)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs tracking-wide uppercase">Period Start</Label>
                <Input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)}
                  className="mt-1.5" required />
              </div>
              <div>
                <Label className="text-xs tracking-wide uppercase">Period End</Label>
                <Input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)}
                  className="mt-1.5" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs tracking-wide uppercase">Hours</Label>
                <Input type="number" step="0.25" min="0" value={hours}
                  onChange={(e) => setHours(e.target.value)} className="mt-1.5" required />
              </div>
              <div>
                <Label className="text-xs tracking-wide uppercase">Rate ($/hr)</Label>
                <Input type="number" step="0.01" min="0" value={rate}
                  onChange={(e) => setRate(e.target.value)} className="mt-1.5" required />
              </div>
            </div>
            {hours && rate && !isNaN(parseFloat(hours)) && !isNaN(parseFloat(rate)) && (
              <p className="text-xs text-muted-foreground tracking-wide uppercase">
                Gross: ${(parseFloat(hours) * parseFloat(rate)).toFixed(2)}
              </p>
            )}
            <div>
              <Label className="text-xs tracking-wide uppercase">Notes</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1.5" />
            </div>
            <Button type="submit" variant="minimal" className="w-full" disabled={submitting}>
              {submitting ? '...' : 'Add Entry'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
            Payroll Ledger
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Unpaid: ${totalUnpaid.toFixed(2)}
          </Badge>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payroll entries yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs tracking-wide uppercase">Employee</TableHead>
                  <TableHead className="text-xs tracking-wide uppercase">Period</TableHead>
                  <TableHead className="text-xs tracking-wide uppercase">Hrs × Rate</TableHead>
                  <TableHead className="text-xs tracking-wide uppercase">Gross</TableHead>
                  <TableHead className="text-xs tracking-wide uppercase">Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-xs">{employeeName(e.employee_id)}</TableCell>
                    <TableCell className="text-xs">{e.period_start} → {e.period_end}</TableCell>
                    <TableCell className="text-xs">{Number(e.hours_worked)} × ${Number(e.hourly_rate).toFixed(2)}</TableCell>
                    <TableCell className="text-xs font-medium">${Number(e.gross_pay).toFixed(2)}</TableCell>
                    <TableCell>
                      {e.paid ? (
                        <Badge className="text-[10px] uppercase">Paid</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] uppercase">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button variant="ghost" size="sm" onClick={() => markPaid(e.id, !e.paid)}
                        title={e.paid ? 'Mark unpaid' : 'Mark paid'}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(e.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollTab;
