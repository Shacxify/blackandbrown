import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ManagedUser } from './EmployeesTab';

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

  const gross = useMemo(() => {
    const h = parseFloat(hours) || 0;
    const r = parseFloat(rate) || 0;
    return (h * r).toFixed(2);
  }, [hours, rate]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payroll_entries')
      .select('*')
      .order('period_end', { ascending: false })
      .limit(200);
    if (error) toast.error(error.message);
    else setEntries(data as PayrollEntry[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !periodStart || !periodEnd) {
      toast.error('Pick an employee and pay period');
      return;
    }
    if (periodEnd < periodStart) {
      toast.error('Period end must be after start');
      return;
    }
    const h = parseFloat(hours);
    const r = parseFloat(rate);
    if (isNaN(h) || h < 0 || isNaN(r) || r < 0) {
      toast.error('Hours and rate must be valid numbers');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('payroll_entries').insert({
      employee_id: employeeId,
      period_start: periodStart,
      period_end: periodEnd,
      hours_worked: h,
      hourly_rate: r,
      gross_pay: parseFloat(gross),
      notes: notes.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Payroll entry recorded');
    setPeriodStart('');
    setPeriodEnd('');
    setHours('');
    setRate('');
    setNotes('');
    load();
  };

  const togglePaid = async (entry: PayrollEntry) => {
    const { error } = await supabase
      .from('payroll_entries')
      .update({
        paid: !entry.paid,
        paid_at: !entry.paid ? new Date().toISOString() : null,
      })
      .eq('id', entry.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(!entry.paid ? 'Marked as paid' : 'Marked unpaid');
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this payroll entry?')) return;
    const { error } = await supabase.from('payroll_entries').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Entry removed');
    load();
  };

  const employeeName = (id: string) => {
    const u = employees.find((e) => e.id === id);
    return u ? u.email.split('@')[0] : id.slice(0, 8);
  };

  const totalUnpaid = entries
    .filter((e) => !e.paid)
    .reduce((sum, e) => sum + Number(e.gross_pay), 0);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs tracking-wide uppercase text-muted-foreground">
              Outstanding
            </p>
            <p className="font-serif text-2xl mt-2">${totalUnpaid.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs tracking-wide uppercase text-muted-foreground">Entries</p>
            <p className="font-serif text-2xl mt-2">{entries.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs tracking-wide uppercase text-muted-foreground">Employees</p>
            <p className="font-serif text-2xl mt-2">{employees.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
              Add Payroll Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label className="text-xs tracking-wide uppercase">Employee</Label>
                <Select value={employeeId} onValueChange={setEmployeeId}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.email.split('@')[0]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="p-start" className="text-xs tracking-wide uppercase">
                    Period Start
                  </Label>
                  <Input
                    id="p-start"
                    type="date"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="p-end" className="text-xs tracking-wide uppercase">
                    Period End
                  </Label>
                  <Input
                    id="p-end"
                    type="date"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="hours" className="text-xs tracking-wide uppercase">
                    Hours
                  </Label>
                  <Input
                    id="hours"
                    type="number"
                    step="0.25"
                    min="0"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rate" className="text-xs tracking-wide uppercase">
                    Rate / hr
                  </Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>
              </div>
              <div className="text-xs tracking-wide uppercase text-muted-foreground">
                Gross Pay: <span className="text-foreground font-mono">${gross}</span>
              </div>
              <div>
                <Label htmlFor="pay-notes" className="text-xs tracking-wide uppercase">
                  Notes
                </Label>
                <Input
                  id="pay-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <Button
                type="submit"
                variant="minimal"
                className="w-full"
                disabled={submitting || employees.length === 0}
              >
                {submitting ? '...' : 'Record Entry'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
              Payroll History
            </CardTitle>
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
                    <TableHead className="text-xs tracking-wide uppercase">Period</TableHead>
                    <TableHead className="text-xs tracking-wide uppercase">Employee</TableHead>
                    <TableHead className="text-xs tracking-wide uppercase">Hrs</TableHead>
                    <TableHead className="text-xs tracking-wide uppercase">Gross</TableHead>
                    <TableHead className="text-xs tracking-wide uppercase">Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-xs">
                        {p.period_start} → {p.period_end}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {employeeName(p.employee_id)}
                      </TableCell>
                      <TableCell className="text-sm">{Number(p.hours_worked).toFixed(2)}</TableCell>
                      <TableCell className="font-mono text-sm">
                        ${Number(p.gross_pay).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={p.paid ? 'default' : 'secondary'}
                          className="text-[10px] uppercase"
                        >
                          {p.paid ? 'Paid' : 'Unpaid'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePaid(p)}
                          title={p.paid ? 'Mark unpaid' : 'Mark paid'}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(p.id)}
                        >
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
    </div>
  );
};

export default PayrollTab;
