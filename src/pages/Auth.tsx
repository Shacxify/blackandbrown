import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const DEMO_EMAIL = 'admin@blackandbrown.demo';

const Auth = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456789');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Map username -> internal email so Supabase auth still works under the hood
    const email = username.trim().toLowerCase() === 'admin'
      ? DEMO_EMAIL
      : `${username.trim().toLowerCase()}@blackandbrown.demo`;

    try {
      let { error } = await supabase.auth.signInWithPassword({ email, password });

      // If the demo admin doesn't exist yet, create it on the fly
      if (error && username.trim().toLowerCase() === 'admin') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: 'Admin' } },
        });
        if (signUpError) throw signUpError;
        const retry = await supabase.auth.signInWithPassword({ email, password });
        if (retry.error) throw retry.error;
        error = null;
      }

      if (error) throw error;

      toast.success('Welcome back');
      navigate('/inventory');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="logo-text text-2xl text-foreground mb-3">Black & Brown</h1>
          <div className="section-divider-decorated mb-3" />
          <p className="text-xs tracking-nav uppercase text-muted-foreground">Employee Portal</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-xl font-light tracking-wide uppercase">
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-xs tracking-wide uppercase">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-xs tracking-wide uppercase">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>
              <Button type="submit" variant="minimal" className="w-full" disabled={loading}>
                {loading ? '...' : 'Sign In'}
              </Button>
            </form>

            <p className="text-center text-[10px] tracking-nav uppercase text-muted-foreground mt-6">
              Demo · admin / 123456789
            </p>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-xs tracking-nav uppercase text-muted-foreground hover:text-foreground"
          >
            ← Back to shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
