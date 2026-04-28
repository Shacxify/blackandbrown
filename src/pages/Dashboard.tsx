import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { Package, BarChart3, Shield, Calendar, DollarSign, Users, Tag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import EmployeeShell from '@/components/employee/EmployeeShell';
import { Card } from '@/components/ui/card';

interface Shift {
  id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  role: string | null;
  notes: string | null;
}

const greetingFor = (hour: number) => {
  if (hour < 5) return 'Burning the midnight oil';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

const formatTime = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return format(d, 'h:mm a');
};

const Dashboard = () => {
  const { user, isEmployee, isAdmin, loading } = useAuth();
  const [firstName, setFirstName] = useState<string>('');
  const [nextShift, setNextShift] = useState<Shift | null>(null);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [shiftsLoading, setShiftsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .maybeSingle();
      const name = profile?.full_name?.trim().split(' ')[0] || profile?.email?.split('@')[0] || 'friend';
      setFirstName(name.charAt(0).toUpperCase() + name.slice(1));

      const today = format(new Date(), 'yyyy-MM-dd');
      const { data: shifts } = await supabase
        .from('shifts')
        .select('*')
        .eq('employee_id', user.id)
        .gte('shift_date', today)
        .order('shift_date', { ascending: true })
        .order('start_time', { ascending: true })
        .limit(5);

      if (shifts && shifts.length) {
        const now = new Date();
        const nowTime = format(now, 'HH:mm:ss');
        const todayShift = shifts.find(
          (s) => s.shift_date === today && s.start_time <= nowTime && s.end_time >= nowTime
        );
        if (todayShift) {
          setCurrentShift(todayShift);
          const upcoming = shifts.find((s) => s.id !== todayShift.id);
          setNextShift(upcoming ?? null);
        } else {
          setNextShift(shifts[0]);
        }
      }
      setShiftsLoading(false);
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground tracking-wide">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isEmployee) return <Navigate to="/inventory" replace />;

  const hour = new Date().getHours();
  const greeting = greetingFor(hour);

  const tools = [
    { title: 'Inventory', desc: 'Add, edit, and price products', url: '/inventory', icon: Package },
    { title: 'Market Trends', desc: 'See what is hot right now', url: '/market-trends', icon: BarChart3 },
    { title: 'Price Check', desc: 'Customer submissions queue', url: '/price-check', icon: Tag },
    ...(isAdmin
      ? [
          { title: 'Schedule', desc: 'Plan the week', url: '/admin?tab=schedule', icon: Calendar },
          { title: 'Payroll', desc: 'Hours and pay periods', url: '/admin?tab=payroll', icon: DollarSign },
          { title: 'Employees', desc: 'Team roster & access', url: '/admin?tab=employees', icon: Users },
          { title: 'Looking For', desc: 'Update buying focus', url: '/admin?tab=looking-for', icon: Tag },
          { title: 'Admin Panel', desc: 'All controls', url: '/admin', icon: Shield },
        ]
      : []),
  ];

  const shiftLabel = (s: Shift) => {
    const d = parseISO(s.shift_date);
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    return format(d, 'EEEE, MMM d');
  };

  return (
    <EmployeeShell title="Dashboard">
      <div className="container mx-auto max-w-5xl px-6 py-12">
        {/* Greeting */}
        <div className="mb-12">
          <p className="text-xs tracking-nav uppercase text-muted-foreground mb-3">
            {format(new Date(), 'EEEE, MMMM d')}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light tracking-wide text-foreground mb-2">
            {greeting}, {firstName}.
          </h1>
          <div className="section-divider-decorated my-4 mx-0" />
          <p className="text-sm text-muted-foreground italic font-serif">
            Glad to have you on the floor today.
          </p>
        </div>

        {/* Shift card */}
        <Card className="mb-12 border-border bg-muted/30 rounded-none">
          <div className="p-8">
            {shiftsLoading ? (
              <p className="text-sm text-muted-foreground">Checking the schedule…</p>
            ) : currentShift ? (
              <div>
                <p className="text-xs tracking-nav uppercase text-muted-foreground mb-2">You're on the clock</p>
                <h2 className="font-serif text-2xl font-light mb-3">
                  Working until {formatTime(currentShift.end_time)}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentShift.role ? `Posted at ${currentShift.role}. ` : ''}
                  Pour yourself something warm and have a good shift.
                </p>
                {nextShift && (
                  <p className="text-xs tracking-nav uppercase text-muted-foreground mt-4 pt-4 border-t border-border">
                    Next up · {shiftLabel(nextShift)} · {formatTime(nextShift.start_time)}
                  </p>
                )}
              </div>
            ) : nextShift ? (
              <div>
                <p className="text-xs tracking-nav uppercase text-muted-foreground mb-2">Your next shift</p>
                <h2 className="font-serif text-2xl font-light mb-3">
                  {shiftLabel(nextShift)} · {formatTime(nextShift.start_time)} – {formatTime(nextShift.end_time)}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {nextShift.role ? `You'll be at ${nextShift.role}. ` : ''}
                  Until then, rest up — the racks will be waiting.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs tracking-nav uppercase text-muted-foreground mb-2">No shifts scheduled</p>
                <h2 className="font-serif text-2xl font-light mb-3">Enjoy the quiet.</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Nothing on the books right now. Check back soon, or reach out to a manager.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Tools */}
        <div>
          <p className="text-xs tracking-nav uppercase text-muted-foreground mb-6">Your toolkit</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {tools.map((tool) => (
              <Link
                key={tool.title}
                to={tool.url}
                className="group bg-background p-6 hover:bg-muted/50 transition-colors flex flex-col gap-3"
              >
                <tool.icon className="h-5 w-5 text-foreground" strokeWidth={1.25} />
                <div>
                  <h3 className="font-serif text-lg font-light tracking-wide text-foreground group-hover:underline underline-offset-4">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </EmployeeShell>
  );
};

export default Dashboard;
