import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmployeesTab, { type ManagedUser } from '@/components/admin/EmployeesTab';
import ScheduleTab from '@/components/admin/ScheduleTab';
import PayrollTab from '@/components/admin/PayrollTab';

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const [employees, setEmployees] = useState<ManagedUser[]>([]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/inventory" replace />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl tracking-wide uppercase mb-3">
            Manager Panel
          </h1>
          <div className="section-divider-decorated mb-3" />
          <p className="text-xs tracking-nav uppercase text-muted-foreground">
            Employees · Scheduling · Payroll
          </p>
        </div>

        <Tabs defaultValue="employees" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="employees" className="text-xs tracking-wide uppercase">
              Employees
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs tracking-wide uppercase">
              Schedule
            </TabsTrigger>
            <TabsTrigger value="payroll" className="text-xs tracking-wide uppercase">
              Payroll
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employees">
            <EmployeesTab currentUserId={user.id} onUsersChange={setEmployees} />
          </TabsContent>
          <TabsContent value="schedule">
            <ScheduleTab employees={employees} />
          </TabsContent>
          <TabsContent value="payroll">
            <PayrollTab employees={employees} />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
