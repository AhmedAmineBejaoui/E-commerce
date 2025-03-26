import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "../product/ProductCard";

export default function FeaturedProducts() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { featured: true }],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(`/api/products?featured=true`);
      if (!res.ok) {
        throw new Error('Failed to fetch featured products');
      }
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold font-heading">Produits Populaires</h2>
            <Link href="/products">
              <a className="text-primary hover:underline font-medium flex items-center">
                Voir tout <i className="fas fa-arrow-right ml-2 text-sm"></i>
              </a>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-4">
                <Skeleton className="w-full h-48 mb-4" />
                <Skeleton className="w-3/4 h-4 mb-2" />
                <Skeleton className="w-1/2 h-4 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="w-1/4 h-6" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold font-heading">Produits Populaires</h2>
          <Link href="/products">
            <a className="text-primary hover:underline font-medium flex items-center">
              Voir tout <i className="fas fa-arrow-right ml-2 text-sm"></i>
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
