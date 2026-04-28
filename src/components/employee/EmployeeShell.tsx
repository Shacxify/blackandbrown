import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import EmployeeSidebar from './EmployeeSidebar';
import { useAuth } from '@/hooks/useAuth';

interface EmployeeShellProps {
  children: ReactNode;
  title?: string;
}

const EmployeeShell = ({ children, title }: EmployeeShellProps) => {
  const { isAdmin } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <EmployeeSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border bg-background sticky top-0 z-40">
            <SidebarTrigger className="ml-2" />
            <div className="ml-3 flex items-center gap-3">
              <span className="text-xs tracking-nav uppercase text-muted-foreground">
                {title ?? 'Employee Portal'}
              </span>
              {isAdmin && (
                <span className="text-[10px] tracking-nav uppercase border border-border px-2 py-0.5 text-muted-foreground">
                  Admin
                </span>
              )}
            </div>
          </header>

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EmployeeShell;
