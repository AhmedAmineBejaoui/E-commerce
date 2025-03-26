import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-primary/90 to-primary text-white py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Accessoires premium pour votre smartphone
          </h1>
          <p className="text-lg mb-6 text-white/90">
            Découvrez notre gamme d'accessoires de haute qualité pour protéger et sublimer votre téléphone.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/products">
              <a className="bg-white text-primary hover:bg-gray-100 font-medium px-6 py-3 rounded-lg transition shadow-lg">
                Découvrir les produits
              </a>
            </Link>
            <Link href="/promo">
              <a className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-lg transition shadow-lg">
                Promotions
              </a>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute right-0 bottom-0 transform translate-x-1/4">
        <img 
          src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
          alt="Smartphone avec accessoires" 
          className="w-96 h-auto object-cover opacity-50 rounded-tl-full"
        />
      </div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
      <div className="absolute top-10 right-1/3 w-20 h-20 bg-orange-500/20 rounded-full"></div>
    </section>
  );
}
