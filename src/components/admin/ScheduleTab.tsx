import { useEffect, useMemo, useState } from 'react';
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
import { displayName, type ManagedUser } from './EmployeesTab';

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

// Store clothing categories — these are the assignable floor areas
const STORE_AREAS = [
  'Jackets & Outerwear',
  'Denim',
  'Tops & Tees',
  'Flannels & Shirts',
  'Dresses',
  'Knitwear',
  'Footwear',
  'Bags & Accessories',
  'Vintage Western',
  'Register',
  'Floor / Floating',
];

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
  const [graphDate, setGraphDate] = useState('');

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
    return u ? displayName(u) : id.slice(0, 8);
  };

  // Default the graph date to the most recent shift date (or today)
  useEffect(() => {
    if (!graphDate && shifts.length > 0) setGraphDate(shifts[0].shift_date);
    else if (!graphDate) setGraphDate(new Date().toISOString().slice(0, 10));
  }, [shifts, graphDate]);

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

  // Bar graph data: count of people scheduled per area on the selected day
  const graphData = useMemo(() => {
    const day = shifts.filter((s) => s.shift_date === graphDate);
    const counts = new Map<string, string[]>();
    for (const s of day) {
      const area = s.role || 'Unassigned';
      const list = counts.get(area) ?? [];
      list.push(employeeName(s.employee_id));
      counts.set(area, list);
    }
    const rows = Array.from(counts.entries()).map(([area, names]) => ({
      area, names, count: names.length,
    }));
    rows.sort((a, b) => b.count - a.count);
    return rows;
  }, [shifts, graphDate, employees]);

  const maxCount = Math.max(1, ...graphData.map((r) => r.count));
  const totalScheduled = graphData.reduce((s, r) => s + r.count, 0);

  // Available dates (unique) for the graph picker
  const availableDates = useMemo(
    () => Array.from(new Set(shifts.map((s) => s.shift_date))).sort().reverse(),
    [shifts]
  );

  return (
    <div className="space-y-8">
      {/* Daily Coverage Bar Graph */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
              Daily Coverage
            </CardTitle>
            <p className="text-xs text-muted-foreground tracking-wide uppercase mt-1">
              {totalScheduled} {totalScheduled === 1 ? 'person' : 'people'} scheduled
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs tracking-wide uppercase text-muted-foreground">Date</Label>
            <Input
              type="date"
              value={graphDate}
              onChange={(e) => setGraphDate(e.target.value)}
              className="w-auto"
              list="schedule-dates"
            />
            <datalist id="schedule-dates">
              {availableDates.map((d) => <option key={d} value={d} />)}
            </datalist>
          </div>
        </CardHeader>
        <CardContent>
          {graphData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No one is scheduled on this day.
            </p>
          ) : (
            <div className="space-y-3">
              {graphData.map((row) => (
                <div key={row.area} className="grid grid-cols-[160px_1fr_32px] items-center gap-3">
                  <div className="text-xs tracking-wide uppercase truncate" title={row.area}>
                    {row.area}
                  </div>
                  <div className="relative h-7 bg-muted/40 rounded-sm overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-foreground/85 transition-all"
                      style={{ width: `${(row.count / maxCount) * 100}%` }}
                    />
                    <div className="absolute inset-0 flex items-center px-2 text-[10px] tracking-wide uppercase text-background mix-blend-difference">
                      {row.names.join(' · ')}
                    </div>
                  </div>
                  <div className="text-sm font-serif text-right tabular-nums">{row.count}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
                      <SelectItem key={u.id} value={u.id}>{displayName(u)}</SelectItem>
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
                <Label className="text-xs tracking-wide uppercase">Assigned Area</Label>
                <Select value={shiftRole} onValueChange={setShiftRole}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select an area" />
                  </SelectTrigger>
                  <SelectContent>
                    {STORE_AREAS.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    <TableHead className="text-xs tracking-wide uppercase">Area</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shifts.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="text-xs">{s.shift_date}</TableCell>
                      <TableCell className="text-xs">{employeeName(s.employee_id)}</TableCell>
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
    </div>
  );
};

export default ScheduleTab;
