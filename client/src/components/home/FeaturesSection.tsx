import { Truck, DollarSign, RefreshCw, Headphones } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Truck className="text-2xl" />,
      title: "Livraison Rapide",
      description: "Livraison à domicile sous 2-3 jours ouvrables."
    },
    {
      icon: <DollarSign className="text-2xl" />,
      title: "Paiement à la Livraison",
      description: "Payez uniquement lorsque vous recevez votre commande."
    },
    {
      icon: <RefreshCw className="text-2xl" />,
      title: "30 Jours de Retour",
      description: "Satisfait ou remboursé pendant 30 jours après l'achat."
    },
    {
      icon: <Headphones className="text-2xl" />,
      title: "Support 24/7",
      description: "Une équipe dédiée à votre service tous les jours."
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {features.map((feature, index) => (
            <div key={index} className="p-6">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="font-medium text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}