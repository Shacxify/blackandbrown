import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { displayName, type ManagedUser } from './EmployeesTab';

type Permission =
  | 'post_to_feed'
  | 'use_estimation'
  | 'manage_payroll'
  | 'manage_schedule';

const PERMISSIONS: { key: Permission; label: string; description: string }[] = [
  { key: 'post_to_feed', label: 'Post to Feed', description: 'Publish products to the storefront' },
  { key: 'use_estimation', label: 'Estimation Tool', description: 'Run price estimates on submissions' },
  { key: 'manage_payroll', label: 'Manage Payroll', description: 'View and edit payroll records' },
  { key: 'manage_schedule', label: 'Manage Schedule', description: 'Create and edit shifts' },
];

interface Props {
  employees: ManagedUser[];
}

const PermissionsTab = ({ employees }: Props) => {
  const [grants, setGrants] = useState<Record<string, Set<Permission>>>({});
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<Set<string>>(new Set());

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_permissions')
      .select('user_id, permission');
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    const map: Record<string, Set<Permission>> = {};
    (data ?? []).forEach((row: { user_id: string; permission: Permission }) => {
      if (!map[row.user_id]) map[row.user_id] = new Set();
      map[row.user_id].add(row.permission);
    });
    setGrants(map);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (userId: string, permission: Permission, checked: boolean) => {
    const key = `${userId}:${permission}`;
    setPending((p) => new Set(p).add(key));

    if (checked) {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('user_permissions')
        .insert({ user_id: userId, permission, granted_by: user?.id });
      if (error) {
        toast.error(error.message);
      } else {
        setGrants((g) => {
          const next = { ...g };
          next[userId] = new Set(next[userId] ?? []);
          next[userId].add(permission);
          return next;
        });
      }
    } else {
      const { error } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId)
        .eq('permission', permission);
      if (error) {
        toast.error(error.message);
      } else {
        setGrants((g) => {
          const next = { ...g };
          next[userId] = new Set(next[userId] ?? []);
          next[userId].delete(permission);
          return next;
        });
      }
    }

    setPending((p) => {
      const n = new Set(p);
      n.delete(key);
      return n;
    });
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground text-center py-12">Loading permissions...</p>;
  }

  if (employees.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-12">No employee accounts yet.</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
            Permission Matrix
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-2">
            Admins automatically have all permissions. Toggle access for individual employees below.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 pr-4 text-xs tracking-wide uppercase font-medium">
                    Employee
                  </th>
                  {PERMISSIONS.map((p) => (
                    <th
                      key={p.key}
                      className="text-center py-3 px-2 text-xs tracking-wide uppercase font-medium"
                      title={p.description}
                    >
                      {p.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((u) => {
                  const isAdmin = u.roles.includes('admin');
                  const userGrants = grants[u.id] ?? new Set();
                  return (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-4 pr-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{displayName(u)}</span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {u.email.split('@')[0]}
                          </span>
                          {isAdmin && (
                            <Badge variant="default" className="mt-1 w-fit text-[10px] uppercase">
                              Admin · All Access
                            </Badge>
                          )}
                        </div>
                      </td>
                      {PERMISSIONS.map((p) => {
                        const key = `${u.id}:${p.key}`;
                        const isPending = pending.has(key);
                        const checked = isAdmin || userGrants.has(p.key);
                        return (
                          <td key={p.key} className="text-center py-4 px-2">
                            <Checkbox
                              checked={checked}
                              disabled={isAdmin || isPending}
                              onCheckedChange={(v) => toggle(u.id, p.key, v === true)}
                              aria-label={`${p.label} for ${displayName(u)}`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-base font-light tracking-wide uppercase">
            Permission Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {PERMISSIONS.map((p) => (
              <li key={p.key} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="font-medium min-w-[150px]">{p.label}</span>
                <span className="text-muted-foreground">{p.description}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsTab;
