import { Link } from "wouter";
import { 
  Phone, 
  MapPin, 
  Mail, 
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 font-heading">PhoneGear</h3>
            <p className="text-gray-400 mb-4">
              Votre boutique d'accessoires pour téléphones. Qualité et innovation à prix abordable.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-blue-500 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-pink-500 transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-blue-400 transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-red-500 transition">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-white transition">Accueil</Link></li>
              <li><Link href="/products" className="hover:text-white transition">Produits</Link></li>
              <li><Link href="/about" className="hover:text-white transition">À propos</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Catégories</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/category/coques-protections" className="hover:text-white transition">Coques et protections</Link></li>
              <li><Link href="/category/chargeurs-cables" className="hover:text-white transition">Chargeurs et câbles</Link></li>
              <li><Link href="/category/ecouteurs-audio" className="hover:text-white transition">Écouteurs et audio</Link></li>
              <li><Link href="/category/supports-stations" className="hover:text-white transition">Supports et stations</Link></li>
              <li><Link href="/category/accessoires-photo" className="hover:text-white transition">Accessoires photo</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-3 text-orange-500" />
                <span>123 Rue du Commerce, 75001 Paris, France</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-orange-500" />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-orange-500" />
                <span>contact@phonegear.fr</span>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-orange-500" />
                <span>Lun-Sam: 9h-19h</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2023 PhoneGear. Tous droits réservés.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition">Politique de confidentialité</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition">Conditions d'utilisation</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition">FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}