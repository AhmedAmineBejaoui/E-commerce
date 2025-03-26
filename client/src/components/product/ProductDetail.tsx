import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  Star, 
  StarHalf, 
  Truck, 
  RefreshCw, 
  DollarSign, 
  MinusIcon, 
  PlusIcon 
} from "lucide-react";
import { useCartContext } from "@/context/CartContext";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

interface ProductDetailProps {
  slug: string;
}

export default function ProductDetail({ slug }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isPending } = useCartContext();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string);
      if (!res.ok) {
        throw new Error("Erreur lors du chargement du produit");
      }
      return res.json();
    },
  });

  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: !!product,
    queryFn: async () => {
      if (!product) return [];
      const res = await fetch(`/api/products?category=${product.categoryId}`);
      if (!res.ok) {
        throw new Error("Erreur lors du chargement des produits similaires");
      }
      const data = await res.json();
      return data.filter((p: Product) => p.id !== product.id).slice(0, 4);
    },
  });

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des produits au panier.",
        variant: "destructive",
      });
      return;
    }

    if (!product) return;

    addToCart({ productId: product.id, quantity });
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

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
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400" />);
    }
    
    return stars;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <Skeleton className="w-full aspect-square rounded-lg" />
          </div>
          <div className="md:w-1/2 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">Erreur lors du chargement du produit</h2>
        <p className="text-gray-600 mt-2">Veuillez réessayer ultérieurement.</p>
        <Button className="mt-4" asChild>
          <Link href="/">Retourner à l'accueil</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex text-sm mb-6 text-gray-500">
        <Link href="/">
          <a className="hover:text-primary">Accueil</a>
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${product.categoryId}`}>
          <a className="hover:text-primary">Catégorie</a>
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-medium">{product.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <img
              src={product.imageUrl || ""}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {renderRatingStars(product.rating ?? 0)}
            </div>
            <span className="text-gray-500">({product.numReviews} avis)</span>
          </div>

          <div className="mb-4">
            {product.discountPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">{product.discountPrice.toFixed(2)} €</span>
                <span className="text-gray-500 line-through">{product.price.toFixed(2)} €</span>
                <span className="bg-orange-500 text-white text-xs py-1 px-2 rounded-full">
                  -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-primary">{product.price.toFixed(2)} €</span>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Stock Status */}
          <div className="mb-4">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <span className="h-2 w-2 bg-green-600 rounded-full inline-block"></span>
                En stock ({product.stock} disponibles)
              </span>
            ) : (
              <span className="text-red-600 font-medium flex items-center gap-1">
                <span className="h-2 w-2 bg-red-600 rounded-full inline-block"></span>
                Rupture de stock
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-gray-700">Quantité:</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="h-10 w-10 rounded-none"
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
                className="h-10 w-10 rounded-none"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isPending || product.stock <= 0}
            >
              {isPending ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Ajout en cours...
                </div>
              ) : (
                <>
                  <ShoppingCartIcon className="mr-2 h-5 w-5" />
                  Ajouter au panier
                </>
              )}
            </Button>
            <Button variant="outline" size="lg">
              <HeartIcon className="mr-2 h-5 w-5" />
              Ajouter aux favoris
            </Button>
          </div>

          {/* Features */}
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="flex items-center text-gray-600">
              <Truck className="h-5 w-5 mr-2 text-primary" />
              <span>Livraison gratuite pour les commandes de plus de 50€</span>
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-5 w-5 mr-2 text-primary" />
              <span>Paiement à la livraison - Sans frais</span>
            </div>
            <div className="flex items-center text-gray-600">
              <RefreshCw className="h-5 w-5 mr-2 text-primary" />
              <span>Retours faciles sous 30 jours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Spécifications</TabsTrigger>
            <TabsTrigger value="reviews">Avis ({product.numReviews})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-4">
            <div className="prose max-w-none">
              <p>{product.description}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, eget aliquam nisl nunc eget nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, eget aliquam nisl nunc eget nisl.</p>
              <ul>
                <li>Haute qualité et durabilité</li>
                <li>Design ergonomique et élégant</li>
                <li>Matériaux premium</li>
                <li>Compatible avec plusieurs modèles de téléphone</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Caractéristiques techniques</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Matière:</span>
                    <span className="font-medium">Premium</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="font-medium">Standard</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Poids:</span>
                    <span className="font-medium">Léger</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Compatibilité:</span>
                    <span className="font-medium">Universelle</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Contenu de l'emballage</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>1x {product.name}</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>1x Manuel d'utilisation</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>1x Carte de garantie</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Avis clients ({product.numReviews})</h3>
                <Button variant="outline">Écrire un avis</Button>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  {renderRatingStars(product.rating ?? 0)}
                </div>
                <span className="text-gray-700 font-medium">{(product.rating ?? 0).toFixed(1)} sur 5</span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Thomas D." className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <h4 className="font-medium">Thomas D.</h4>
                      <div className="flex text-yellow-400">
                        <Star className="h-4 w-4 fill-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400" />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">Excellent produit ! La qualité est au rendez-vous, je recommande vivement.</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sophie M." className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <h4 className="font-medium">Sophie M.</h4>
                      <div className="flex text-yellow-400">
                        <Star className="h-4 w-4 fill-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400" />
                        <Star className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">Très satisfaite de mon achat. Le produit correspond parfaitement à la description.</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition group overflow-hidden">
                <Link href={`/product/${relatedProduct.slug}`}>
                  <a>
                    <div className="relative">
                      <img
                        src={relatedProduct.imageUrl ?? 'default-image-url.jpg'}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover"
                      />
                      {relatedProduct.discountPrice && (
                        <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs py-1 px-2 rounded-full">
                          -{Math.round(((relatedProduct.price - relatedProduct.discountPrice) / relatedProduct.price) * 100)}%
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 mb-1">{relatedProduct.name}</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          {relatedProduct.discountPrice ? (
                            <>
                              <span className="font-bold text-primary">{relatedProduct.discountPrice.toFixed(2)} €</span>
                              <span className="text-gray-400 text-sm line-through ml-1">{relatedProduct.price.toFixed(2)} €</span>
                            </>
                          ) : (
                            <span className="font-bold text-primary">{relatedProduct.price.toFixed(2)} €</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
