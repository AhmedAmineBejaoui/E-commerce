import AdminSidebar from "@/components/admin/AdminSidebar";
import Dashboard from "@/components/admin/Dashboard";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="lg:pl-64">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
            <p className="text-gray-500">Bienvenue dans votre tableau de bord administrateur</p>
          </div>
          
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
