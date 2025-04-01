import { useState } from 'react';
import { Link } from 'wouter';
import { Product } from 'server/src/schema';
import { Heart, ShoppingCart, Star, StarHalf } from 'lucide-react';
import { useCartContext } from '@/context/CartContext';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, isPending } = useCartContext();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des produits au panier.",
        variant: "destructive",
      });
      return;
    }
    
    addToCart({ productId: product.id, quantity: 1 });
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

  return (
    <Link href={`/product/${product.slug}`}>
      <a 
        className="bg-white rounded-xl shadow-md hover:shadow-lg transition group overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <img 
            src={product.imageUrl ?? ''} 
            alt={product.name} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 flex space-x-1">
            {product.discountPrice && (
              <span className="bg-orange-500 text-white text-xs py-1 px-2 rounded-full">
                -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-green-500 text-white text-xs py-1 px-2 rounded-full">Nouveau</span>
            )}
          </div>
          <button 
            className="absolute top-2 left-2 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-sm text-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast({
                title: "Favoris",
                description: "Fonctionnalité à venir",
                variant: "default",
              });
            }}
          >
            <Heart className="h-4 w-4" />
          </button>
          <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              className={`bg-white text-gray-800 py-2 px-4 rounded-lg shadow-md transform transition-transform duration-300 ${isHovered ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'} text-sm font-medium`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/product/${product.slug}`;
              }}
            >
              Aperçu rapide
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center text-yellow-400 text-sm mb-1">
            {product.rating !== null ? renderRatingStars(product.rating) : null}
            <span className="text-gray-500 ml-1 text-xs">({product.numReviews})</span>
          </div>
          <h3 className="font-medium text-gray-800 mb-1">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-2">{product.description?.substring(0, 30)}...</p>
          <div className="flex items-center justify-between">
            <div>
              {product.discountPrice ? (
                <>
                  <span className="font-bold text-primary">{product.discountPrice.toFixed(2)} €</span>
                  <span className="text-gray-400 text-sm line-through ml-1">{product.price.toFixed(2)} €</span>
                </>
              ) : (
                <span className="font-bold text-primary">{product.price.toFixed(2)} €</span>
              )}
            </div>
            <button 
              className="bg-primary/10 text-primary p-1.5 rounded-full hover:bg-primary/20 transition disabled:opacity-50"
              onClick={handleAddToCart}
              disabled={isPending || product.stock <= 0}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </a>
    </Link>
  );
}
