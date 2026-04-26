import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InventoryManager from '@/components/InventoryManager';

const Inventory = () => {
  const { user, isEmployee, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground tracking-wide">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!isEmployee) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="py-24 text-center container mx-auto px-4 max-w-md">
          <h2 className="font-serif text-2xl tracking-wide uppercase mb-4">Access Pending</h2>
          <div className="section-divider-decorated mb-6" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your account is created but does not yet have employee access. An admin must grant you the employee role
            from the Cloud → Database → user_roles table before you can manage inventory.
          </p>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <InventoryManager />
      <Footer />
    </div>
  );
};

export default Inventory;
