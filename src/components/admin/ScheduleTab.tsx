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
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ManagedUser } from './EmployeesTab';

interface Shift {
  id: string;
  employee_id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  role: string | null;
  notes: string | null;
}

interface Props {
  employees: ManagedUser[];
}

const ScheduleTab = ({ employees }: Props) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [shiftDate, setShiftDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [shiftRole, setShiftRole] = useState('');
  const [notes, setNotes] = useState('');

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .order('shift_date', { ascending: false })
      .order('start_time', { ascending: true });
    if (error) toast.error(error.message);
    else setShifts((data as Shift[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const employeeName = (id: string) => {
    const u = employees.find((e) => e.id === id);
    return u ? u.email.split('@')[0] : id.slice(0, 8);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !shiftDate) {
      toast.error('Pick an employee and date');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('shifts').insert({
      employee_id: employeeId,
      shift_date: shiftDate,
      start_time: startTime,
      end_time: endTime,
      role: shiftRole || null,
      notes: notes || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Shift scheduled');
    setShiftDate(''); setShiftRole(''); setNotes('');
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this shift?')) return;
    const { error } = await supabase.from('shifts').delete().eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Shift removed'); load(); }
  };

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
            Schedule a Shift
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
                    <SelectItem key={u.id} value={u.id}>{u.email.split('@')[0]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs tracking-wide uppercase">Date</Label>
              <Input type="date" value={shiftDate} onChange={(e) => setShiftDate(e.target.value)}
                className="mt-1.5" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs tracking-wide uppercase">Start</Label>
                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1.5" required />
              </div>
              <div>
                <Label className="text-xs tracking-wide uppercase">End</Label>
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1.5" required />
              </div>
            </div>
            <div>
              <Label className="text-xs tracking-wide uppercase">Role (optional)</Label>
              <Input value={shiftRole} onChange={(e) => setShiftRole(e.target.value)}
                placeholder="e.g. Floor, Register" className="mt-1.5" />
            </div>
            <div>
              <Label className="text-xs tracking-wide uppercase">Notes</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1.5" />
            </div>
            <Button type="submit" variant="minimal" className="w-full" disabled={submitting}>
              {submitting ? '...' : 'Add Shift'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
            Upcoming & Recent Shifts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : shifts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No shifts scheduled.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs tracking-wide uppercase">Date</TableHead>
                  <TableHead className="text-xs tracking-wide uppercase">Employee</TableHead>
                  <TableHead className="text-xs tracking-wide uppercase">Time</TableHead>
                  <TableHead className="text-xs tracking-wide uppercase">Role</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-xs">{s.shift_date}</TableCell>
                    <TableCell className="font-mono text-xs">{employeeName(s.employee_id)}</TableCell>
                    <TableCell className="text-xs">{s.start_time.slice(0,5)} – {s.end_time.slice(0,5)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{s.role ?? '—'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}>
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

export default ScheduleTab;
