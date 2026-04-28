import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import EmployeeShell from '@/components/employee/EmployeeShell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import EmployeesTab, { type ManagedUser } from '@/components/admin/EmployeesTab';
import ScheduleTab from '@/components/admin/ScheduleTab';
import PayrollTab from '@/components/admin/PayrollTab';
import LookingForTab from '@/components/admin/LookingForTab';
import PermissionsTab from '@/components/admin/PermissionsTab';

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [listLoading, setListLoading] = useState(true);

  const loadUsers = async () => {
    setListLoading(true);
    const { data, error } = await supabase.functions.invoke('admin-create-employee', {
      body: { action: 'list' },
    });
    if (error) toast.error(error.message);
    else if (data?.users) setUsers(data.users);
    setListLoading(false);
  };

  useEffect(() => {
    if (isAdmin) loadUsers();
  }, [isAdmin]);

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
    <EmployeeShell title="Manager Control Panel">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl tracking-wide uppercase mb-3">
            Manager Control Panel
          </h1>
          <div className="section-divider-decorated mb-3" />
          <p className="text-xs tracking-nav uppercase text-muted-foreground">
            Employees · Scheduling · Payroll
          </p>
        </div>

        <Tabs defaultValue="employees" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-2 md:grid-cols-5 mb-8 h-auto">
            <TabsTrigger value="employees" className="text-xs tracking-wide uppercase">Employees</TabsTrigger>
            <TabsTrigger value="permissions" className="text-xs tracking-wide uppercase">Permissions</TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs tracking-wide uppercase">Schedule</TabsTrigger>
            <TabsTrigger value="payroll" className="text-xs tracking-wide uppercase">Payroll</TabsTrigger>
            <TabsTrigger value="looking-for" className="text-xs tracking-wide uppercase">Looking For</TabsTrigger>
          </TabsList>

          <TabsContent value="employees">
            <EmployeesTab users={users} listLoading={listLoading} reload={loadUsers} />
          </TabsContent>
          <TabsContent value="permissions">
            <PermissionsTab employees={users} />
          </TabsContent>
          <TabsContent value="schedule">
            <ScheduleTab employees={users} />
          </TabsContent>
          <TabsContent value="payroll">
            <PayrollTab employees={users} />
          </TabsContent>
          <TabsContent value="looking-for">
            <LookingForTab />
          </TabsContent>
        </Tabs>
      </div>
    </EmployeeShell>
  );
};

export default Admin;
