import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ManagedUser {
  id: string;
  email: string;
  created_at: string;
  roles: string[];
}

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'employee' | 'admin'>('employee');

  const loadUsers = async () => {
    setListLoading(true);
    const { data, error } = await supabase.functions.invoke('admin-create-employee', {
      body: { action: 'list' },
    });
    if (error) {
      toast.error(error.message);
    } else if (data?.users) {
      setUsers(data.users);
    }
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke('admin-create-employee', {
      body: {
        action: 'create',
        username: username.trim().toLowerCase(),
        password,
        fullName: fullName.trim(),
        role,
      },
    });
    setSubmitting(false);
    if (error || data?.error) {
      toast.error(data?.error || error?.message || 'Failed to create');
      return;
    }
    toast.success(`Account created: ${data.user.username}`);
    setUsername('');
    setFullName('');
    setPassword('');
    setRole('employee');
    loadUsers();
  };

  const handleDelete = async (target: ManagedUser) => {
    if (target.id === user.id) {
      toast.error('You cannot delete your own account');
      return;
    }
    if (!confirm(`Remove ${target.email}? This cannot be undone.`)) return;
    const { data, error } = await supabase.functions.invoke('admin-create-employee', {
      body: { action: 'delete', userId: target.id },
    });
    if (error || data?.error) {
      toast.error(data?.error || error?.message || 'Failed to delete');
      return;
    }
    toast.success('Account removed');
    loadUsers();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl tracking-wide uppercase mb-3">
            Admin Control Panel
          </h1>
          <div className="section-divider-decorated mb-3" />
          <p className="text-xs tracking-nav uppercase text-muted-foreground">
            Manage employee accounts
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
                Add New Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label htmlFor="new-username" className="text-xs tracking-wide uppercase">
                    Username
                  </Label>
                  <Input
                    id="new-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. jane"
                    className="mt-1.5"
                    autoComplete="off"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="new-name" className="text-xs tracking-wide uppercase">
                    Full Name
                  </Label>
                  <Input
                    id="new-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="mt-1.5"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <Label htmlFor="new-password" className="text-xs tracking-wide uppercase">
                    Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="mt-1.5"
                    autoComplete="new-password"
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <Label className="text-xs tracking-wide uppercase">Role</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as 'employee' | 'admin')}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" variant="minimal" className="w-full" disabled={submitting}>
                  {submitting ? '...' : 'Create Account'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg font-light tracking-wide uppercase">
                Existing Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {listLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : users.length === 0 ? (
                <p className="text-sm text-muted-foreground">No accounts yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs tracking-wide uppercase">User</TableHead>
                      <TableHead className="text-xs tracking-wide uppercase">Role</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => {
                      const username = u.email.split('@')[0];
                      const isSelf = u.id === user.id;
                      return (
                        <TableRow key={u.id}>
                          <TableCell className="font-mono text-xs">{username}</TableCell>
                          <TableCell>
                            {u.roles.map((r) => (
                              <Badge
                                key={r}
                                variant={r === 'admin' ? 'default' : 'secondary'}
                                className="mr-1 text-[10px] uppercase"
                              >
                                {r}
                              </Badge>
                            ))}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(u)}
                              disabled={isSelf}
                              title={isSelf ? 'Cannot delete yourself' : 'Remove account'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
