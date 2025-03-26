import AdminSidebar from "@/components/admin/AdminSidebar";
import OrdersList from "@/components/admin/OrdersList";

export default function AdminOrdersPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="lg:pl-64">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Gestion des commandes</h1>
            <p className="text-gray-500">Suivez et gérez les commandes de vos clients</p>
          </div>
          
          <OrdersList />
        </div>
      </div>
    </div>
  );
}