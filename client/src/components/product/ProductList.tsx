import { useQuery } from '@tanstack/react-query';
import { Product } from 'shared/src/schema';
import ProductCard from './ProductCard';
import { Skeleton } from '../../components/ui/skeleton';

interface ProductListProps {
  categoryId?: number;
  featured?: boolean;
  newArrivals?: boolean;
  limit?: number;
}

export default function ProductList({ categoryId, featured, newArrivals, limit }: ProductListProps) {
  const queryParams = new URLSearchParams();
  
  if (categoryId) queryParams.append('category', categoryId.toString());
  if (featured) queryParams.append('featured', 'true');
  if (newArrivals) queryParams.append('new', 'true');

  const queryUrl = `/api/products?${queryParams.toString()}`;

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products', categoryId, featured, newArrivals],
    queryFn: async () => {
      const res = await fetch(queryUrl);
      if (!res.ok) throw new Error("Erreur lors de la récupération des produits");
      return res.json();
    },
    staleTime: 60000,
  });


  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {Array(limit || 8).fill(0).map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-4">
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
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Une erreur est survenue lors du chargement des produits.</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucun produit disponible pour le moment.</p>
      </div>
    );
  }

  const displayProducts = limit ? products.slice(0, limit) : products;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {displayProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}