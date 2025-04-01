import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Product } from "server/src/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, StarHalf } from "lucide-react";

export default function NewArrivals() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { new: true }],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(`/api/products?new=true`);
      if (!res.ok) {
        throw new Error('Failed to fetch new products');
      }
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold font-heading">Nouveautés</h2>
            <Link href="/new">
              <a className="text-primary hover:underline font-medium flex items-center">
                Voir tout <i className="fas fa-arrow-right ml-2 text-sm"></i>
              </a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-4">
                <div className="flex flex-col md:flex-row">
                  <Skeleton className="w-full md:w-1/3 h-48 md:h-full rounded-md" />
                  <div className="p-4 md:w-2/3">
                    <Skeleton className="w-3/4 h-4 mb-2" />
                    <Skeleton className="w-1/2 h-4 mb-4" />
                    <Skeleton className="w-full h-4 mb-2" />
                    <div className="flex justify-between mt-4">
                      <Skeleton className="w-1/4 h-6" />
                      <Skeleton className="w-1/3 h-8 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    return stars;
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold font-heading">Nouveautés</h2>
          <Link href="/new">
            <a className="text-primary hover:underline font-medium flex items-center">
              Voir tout <i className="fas fa-arrow-right ml-2 text-sm"></i>
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products?.slice(0, 3).map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition group overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="relative md:w-1/3">
                  <img 
                    src={product.imageUrl ?? '/default-image.jpg'} 
                    alt={product.name} 
                    className="w-full h-48 md:h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs py-1 px-2 rounded-full">
                    Nouveau
                  </span>
                </div>
                <div className="p-4 md:w-2/3">
                  <div className="flex items-center text-yellow-400 text-sm mb-1">
                    {renderRatingStars(product.rating ?? 0)}
                    <span className="text-gray-500 ml-1 text-xs">({product.numReviews})</span>
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">{product.description?.substring(0, 60)}...</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">
                      {product.discountPrice ? (
                        <>
                          {product.discountPrice.toFixed(2)} € <span className="text-gray-400 text-sm line-through ml-1">{product.price.toFixed(2)} €</span>
                        </>
                      ) : (
                        `${product.price.toFixed(2)} €`
                      )}
                    </span>
                    <Link href={`/product/${product.slug}`}>
                      <a className="bg-primary text-white py-1 px-3 rounded-lg text-sm hover:bg-primary/90 transition">
                        Ajouter au panier
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
