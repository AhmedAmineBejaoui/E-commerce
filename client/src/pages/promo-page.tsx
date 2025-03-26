import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import MainLayout from "@/components/layout/MainLayout";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function PromotionsPage() {
  const { data: discountedProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/promo"],
    staleTime: 60000, // 1 minute
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Promotions</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Profitez de nos offres spéciales sur une large gamme d'accessoires pour téléphones. Stocks limités, ne tardez pas !
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {discountedProducts && discountedProducts.length > 0 ? (
              discountedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
                  <div className="relative">
                    <Link href={`/product/${product.slug}`}>
                      <img 
                        src={product.imageUrl || "/placeholder-product.jpg"} 
                        alt={product.name} 
                        className="w-full h-64 object-cover"
                      />
                    </Link>
                    
                    {product.discountPrice && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <Link href={`/product/${product.slug}`}>
                      <h2 className="text-lg font-semibold text-gray-800 hover:text-primary transition-colors mb-1">{product.name}</h2>
                    </Link>
                    <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        {product.discountPrice ? (
                          <>
                            <span className="text-lg font-bold text-primary">{product.discountPrice.toFixed(2)} €</span>
                            <span className="text-sm text-gray-500 line-through ml-2">{product.price.toFixed(2)} €</span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-primary">{product.price.toFixed(2)} €</span>
                        )}
                      </div>
                      
                      <Link href={`/product/${product.slug}`} className="bg-primary text-white px-3 py-1 rounded-full text-sm hover:bg-primary-dark transition-colors">
                        Voir
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <p className="text-xl text-gray-500">Aucune promotion en cours actuellement</p>
                <p className="mt-2 text-gray-400">Revenez bientôt pour découvrir nos prochaines offres</p>
                <Link href="/" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition">
                  Retour à l'accueil
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}