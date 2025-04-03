import MainLayout from "../components/layout/MainLayout";
import { CheckCircle, Award, Package, ShieldCheck, Truck, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">À propos de PhoneGear</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre histoire, notre mission et nos valeurs. PhoneGear est bien plus qu'une boutique d'accessoires pour téléphones.
          </p>
        </div>
        
        {/* Section Notre Histoire */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                alt="Notre magasin" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-8 md:p-12 md:w-1/2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Notre Histoire</h2>
              <div className="prose max-w-none text-gray-600">
                <p>
                  Fondée en 2018, PhoneGear est née d'une passion pour la technologie mobile et d'un constat simple : les accessoires de qualité manquaient sur le marché. Notre fondateur, Alex Martin, ingénieur en électronique, a décidé de créer une boutique proposant uniquement des produits testés et approuvés par une équipe d'experts.
                </p>
                <p className="mt-4">
                  Ce qui a commencé comme une petite boutique en ligne est rapidement devenu une référence dans le domaine des accessoires pour smartphones. Grâce à notre engagement envers la qualité et le service client, nous avons connu une croissance rapide tout en conservant nos valeurs fondamentales.
                </p>
                <p className="mt-4">
                  Aujourd'hui, PhoneGear c'est une équipe de 25 personnes passionnées, plus de 10 000 commandes traitées chaque mois, et une sélection rigoureuse des meilleurs accessoires du marché pour garantir votre satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section Mission et Valeurs */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Notre Mission & Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Qualité Premium</h3>
              <p className="text-gray-600">
                Nous ne proposons que des produits de qualité supérieure, testés rigoureusement par notre équipe technique pour garantir leur durabilité et leur performance.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Service Client Exemplaire</h3>
              <p className="text-gray-600">
                Votre satisfaction est notre priorité. Notre équipe de support est disponible pour répondre à toutes vos questions et résoudre rapidement vos problèmes.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Confiance et Transparence</h3>
              <p className="text-gray-600">
                Nous croyons en une relation honnête avec nos clients. Prix clairs, descriptions précises et avis authentiques sont les piliers de notre approche.
              </p>
            </div>
          </div>
        </div>
        
        {/* Section Pourquoi Nous Choisir */}
        <div className="bg-gray-50 py-12 px-4 rounded-xl mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Pourquoi Choisir PhoneGear ?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex">
              <div className="mr-4">
                <Award className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Produits Sélectionnés</h3>
                <p className="text-gray-600">Tous nos produits sont soigneusement sélectionnés pour leur qualité et leur durabilité.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4">
                <Package className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Garantie Satisfaction</h3>
                <p className="text-gray-600">Nous offrons une garantie de 30 jours satisfait ou remboursé sur tous nos articles.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4">
                <Truck className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Livraison Rapide</h3>
                <p className="text-gray-600">Expédition sous 24h et livraison en 2-3 jours ouvrés dans toute la France.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4">
                <ShieldCheck className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Paiement Sécurisé</h3>
                <p className="text-gray-600">Nous utilisons les meilleures technologies de cryptage pour sécuriser vos transactions.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Support Réactif</h3>
                <p className="text-gray-600">Notre équipe de support est disponible 6j/7 pour répondre à toutes vos questions.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Avis Vérifiés</h3>
                <p className="text-gray-600">Tous les avis clients sur notre site sont authentiques et vérifiés.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section Équipe */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Notre Équipe</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80" 
                alt="Alex Martin - Fondateur" 
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">Alex Martin</h3>
                <p className="text-primary font-medium">Fondateur & CEO</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80" 
                alt="Sophie Dubois - Directrice Marketing" 
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">Sophie Dubois</h3>
                <p className="text-primary font-medium">Directrice Marketing</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80" 
                alt="Thomas Lefèvre - Responsable Technique" 
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">Thomas Lefèvre</h3>
                <p className="text-primary font-medium">Responsable Technique</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1573497019236-61f323342eb4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80" 
                alt="Julie Moreau - Service Client" 
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">Julie Moreau</h3>
                <p className="text-primary font-medium">Responsable Service Client</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}