import { useEffect, useState } from 'react';
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

  const loadShifts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .order('shift_date', { ascending: false })
      .order('start_time', { ascending: true })
      .limit(200);
    if (error) toast.error(error.message);
    else setShifts(data as Shift[]);
    setLoading(false);
  };

  useEffect(() => {
    loadShifts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !shiftDate) {
      toast.error('Pick an employee and a date');
      return;
    }
    if (endTime <= startTime) {
      toast.error('End time must be after start time');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('shifts').insert({
      employee_id: employeeId,
      shift_date: shiftDate,
      start_time: startTime,
      end_time: endTime,
      role: shiftRole.trim() || null,
      notes: notes.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Shift scheduled');
    setShiftDate('');
    setShiftRole('');
    setNotes('');
    loadShifts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this shift?')) return;
    const { error } = await supabase.from('shifts').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Shift removed');
    loadShifts();
  };

  const employeeName = (id: string) => {
    const u = employees.find((e) => e.id === id);
    return u ? u.email.split('@')[0] : id.slice(0, 8);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
            Schedule Shift
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
            <div>
              <Label htmlFor="shift-date" className="text-xs tracking-wide uppercase">
                Date
              </Label>
              <Input
                id="shift-date"
                type="date"
                value={shiftDate}
                onChange={(e) => setShiftDate(e.target.value)}
                className="mt-1.5"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="start-time" className="text-xs tracking-wide uppercase">
                  Start
                </Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="end-time" className="text-xs tracking-wide uppercase">
                  End
                </Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="shift-role" className="text-xs tracking-wide uppercase">
                Role (optional)
              </Label>
              <Input
                id="shift-role"
                value={shiftRole}
                onChange={(e) => setShiftRole(e.target.value)}
                placeholder="e.g. Floor, Inventory"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="shift-notes" className="text-xs tracking-wide uppercase">
                Notes
              </Label>
              <Input
                id="shift-notes"
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
              {submitting ? '...' : 'Add Shift'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
            Upcoming & Recent Shifts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : shifts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No shifts scheduled yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs tracking-wide uppercase">Date</TableHead>
                  <TableHead className="text-xs tracking-wide uppercase">Employee</TableHead>
                  <TableHead className="text-xs tracking-wide uppercase">Hours</TableHead>
                  <TableHead className="text-xs tracking-wide uppercase">Role</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-sm">{s.shift_date}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {employeeName(s.employee_id)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {s.start_time.slice(0, 5)} – {s.end_time.slice(0, 5)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {s.role || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(s.id)}
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
  );
};

export default ScheduleTab;
