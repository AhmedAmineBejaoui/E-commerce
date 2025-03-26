import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCartContext } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  User, 
  Search, 
  ChevronDown, 
  Menu, 
  X 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";

export default function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart } = useCartContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    staleTime: Infinity,
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary font-heading">PhoneGear</span>
          </Link>
          
          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex relative flex-grow max-w-md mx-6">
            <input 
              type="text" 
              placeholder="Rechercher un accessoire..." 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary">
              <Search size={18} />
            </button>
          </div>
          
          {/* User Actions */}
          <div className="flex items-center space-x-6">
            {/* Cart */}
            <div className="relative">
              <button 
                className="flex items-center space-x-1 text-gray-800 hover:text-primary transition"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center absolute -top-2 -right-2">
                    {cartCount}
                  </span>
                )}
              </button>
              
              {/* Mini Cart Dropdown */}
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <h4 className="font-medium">Mon Panier ({cartCount} articles)</h4>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto p-2">
                    {cartItems.length === 0 ? (
                      <p className="text-center py-4 text-gray-500">Votre panier est vide</p>
                    ) : (
                      cartItems.map((item) => (
                        <div key={item.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                          <img 
                            src={item.product.imageUrl ?? ''} 
                            alt={item.product.name} 
                            className="w-16 h-16 object-cover rounded-md mr-3"
                          />
                          <div className="flex-grow">
                            <h5 className="text-sm font-medium">{item.product.name}</h5>
                            <p className="text-gray-500 text-xs">{item.product.description?.substring(0, 20)}...</p>
                            <div className="flex justify-between items-center mt-1">
                              <span className="font-medium text-primary">
                                {(item.product.discountPrice || item.product.price).toFixed(2)} €
                              </span>
                              <div className="flex items-center space-x-2">
                                <button 
                                  className="text-xs bg-gray-200 px-2 rounded"
                                  onClick={() => item.quantity > 1 && updateQuantity({ id: item.id, quantity: item.quantity - 1 })}
                                >
                                  -
                                </button>
                                <span className="text-sm">{item.quantity}</span>
                                <button 
                                  className="text-xs bg-gray-200 px-2 rounded"
                                  onClick={() => updateQuantity({ id: item.id, quantity: item.quantity + 1 })}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                          <button 
                            className="text-gray-400 hover:text-red-500 ml-2"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="font-medium">{cartTotal.toFixed(2)} €</span>
                    </div>
                    <Link href="/cart" className="block w-full bg-primary text-white text-center py-2 rounded-lg hover:bg-primary/90 transition">
                      Voir le panier
                    </Link>
                    <Link href="/checkout" className="block w-full bg-secondary text-white text-center py-2 rounded-lg mt-2 hover:bg-secondary/90 transition">
                      Commander
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-800 hover:text-primary transition">
                <User className="h-5 w-5" />
                <span className="hidden md:inline-block">
                  {user ? user.username : "Compte"}
                </span>
              </button>
              
              {/* User Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 hidden group-hover:block z-50">
                <div className="py-2">
                  {!user ? (
                    <>
                      <Link href="/auth" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <i className="fas fa-sign-in-alt w-5 inline-block"></i> Connexion
                      </Link>
                      <Link href="/auth" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <i className="fas fa-user-plus w-5 inline-block"></i> Inscription
                      </Link>
                    </>
                  ) : (
                    <>
                      {user.isAdmin && (
                        <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <i className="fas fa-tachometer-alt w-5 inline-block"></i> Dashboard Admin
                        </Link>
                      )}
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <i className="fas fa-user w-5 inline-block"></i> Mon profil
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <i className="fas fa-box w-5 inline-block"></i> Mes commandes
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <i className="fas fa-sign-out-alt w-5 inline-block"></i> Déconnexion
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Navigation (Desktop) */}
        <nav className="hidden md:flex py-4">
          <ul className="flex space-x-8 text-sm font-medium">
            <li>
              <Link 
                href="/"
                className={location === "/" ? "text-primary border-b-2 border-primary pb-4" : "text-gray-600 hover:text-primary"}
              >
                Accueil
              </Link>
            </li>
            <li className="group relative">
              <a href="#" className="text-gray-600 hover:text-primary flex items-center">
                Catégories <ChevronDown className="ml-1 h-4 w-4" />
              </a>
              {categories && categories.length > 0 && (
                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {categories.map((category) => (
                      <Link 
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
            <li>
              <Link 
                href="/new"
                className={location === "/new" ? "text-primary border-b-2 border-primary pb-4" : "text-gray-600 hover:text-primary"}
              >
                Nouveautés
              </Link>
            </li>
            <li>
              <Link 
                href="/promo"
                className={location === "/promo" ? "text-primary border-b-2 border-primary pb-4" : "text-gray-600 hover:text-primary"}
              >
                Promotions
              </Link>
            </li>
            <li>
              <Link 
                href="/contact"
                className={location === "/contact" ? "text-primary border-b-2 border-primary pb-4" : "text-gray-600 hover:text-primary"}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link 
                href="/about"
                className={location === "/about" ? "text-primary border-b-2 border-primary pb-4" : "text-gray-600 hover:text-primary"}
              >
                À propos
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center justify-between py-4">
          <button 
            className="text-gray-500 hover:text-primary focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-4">
            <button 
              className="text-gray-500 hover:text-primary focus:outline-none"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <Search className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Mobile Search */}
        {isMobileSearchOpen && (
          <div className="md:hidden pb-4">
            <input 
              type="text" 
              placeholder="Rechercher un accessoire..." 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <ul className="space-y-2 py-4">
              <li>
                <Link 
                  href="/"
                  className={location === "/" ? "block px-4 py-2 text-primary font-medium" : "block px-4 py-2 text-gray-600 font-medium"}
                >
                  Accueil
                </Link>
              </li>
              <li>
                <button className="flex justify-between items-center w-full px-4 py-2 text-gray-600 font-medium">
                  Catégories <ChevronDown className="h-4 w-4" />
                </button>
                {categories && (
                  <ul className="pl-8 py-2 space-y-1">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link 
                          href={`/category/${category.slug}`}
                          className="block px-4 py-2 text-sm text-gray-600"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <Link 
                  href="/new"
                  className={location === "/new" ? "block px-4 py-2 text-primary font-medium" : "block px-4 py-2 text-gray-600 font-medium"}
                >
                  Nouveautés
                </Link>
              </li>
              <li>
                <Link 
                  href="/promo"
                  className={location === "/promo" ? "block px-4 py-2 text-primary font-medium" : "block px-4 py-2 text-gray-600 font-medium"}
                >
                  Promotions
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact"
                  className={location === "/contact" ? "block px-4 py-2 text-primary font-medium" : "block px-4 py-2 text-gray-600 font-medium"}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/about"
                  className={location === "/about" ? "block px-4 py-2 text-primary font-medium" : "block px-4 py-2 text-gray-600 font-medium"}
                >
                  À propos
                </Link>
              </li>
            </ul>
            <div className="border-t border-gray-200 py-4">
              {!user ? (
                <>
                  <Link href="/auth" className="block px-4 py-2 text-gray-600 font-medium">
                    <i className="fas fa-sign-in-alt mr-2"></i> Connexion
                  </Link>
                  <Link href="/auth" className="block px-4 py-2 text-gray-600 font-medium">
                    <i className="fas fa-user-plus mr-2"></i> Inscription
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/profile" className="block px-4 py-2 text-gray-600 font-medium">
                    <i className="fas fa-user mr-2"></i> Mon profil
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-gray-600 font-medium">
                    <i className="fas fa-box mr-2"></i> Mes commandes
                  </Link>
                  {user.isAdmin && (
                    <Link href="/admin/dashboard" className="block px-4 py-2 text-gray-600 font-medium">
                      <i className="fas fa-tachometer-alt mr-2"></i> Dashboard Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 font-medium"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i> Déconnexion
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
