import { useQuery } from "@tanstack/react-query";
import { Product } from "shared/src/schema.ts";
import ProductList from "../components/product/ProductList";
import MainLayout from "../components/layout/MainLayout";
import { Loader2 } from "lucide-react";

export default function NewProductsPage() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/new"],
    staleTime: 60000, // 1 minute
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Nouveautés</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez nos derniers accessoires pour téléphones. Des produits innovants et de haute qualité pour améliorer votre expérience mobile.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <ProductList newArrivals={true} limit={12} />
        )}
      </div>
    </MainLayout>
  );
}