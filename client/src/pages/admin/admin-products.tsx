import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductsList from "@/components/admin/ProductsList";

export default function AdminProductsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="lg:pl-64">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Gestion des produits</h1>
            <p className="text-gray-500">Gérez le catalogue de produits de votre boutique</p>
          </div>
          
          <ProductsList />
        </div>
      </div>
    </div>
  );
}