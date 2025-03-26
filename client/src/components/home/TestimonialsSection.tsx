import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      content: "Les coques sont vraiment de haute qualité et protègent parfaitement mon téléphone. J'ai déjà fait tomber mon téléphone plusieurs fois et il n'a pas une seule égratignure!",
      author: {
        name: "Sophie M.",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        info: "Client depuis 1 an"
      },
      rating: 5
    },
    {
      content: "La livraison a été rapide et le paiement à la livraison est vraiment pratique. Le chargeur que j'ai acheté fonctionne parfaitement et charge mon téléphone en un temps record.",
      author: {
        name: "Thomas D.",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        info: "Client depuis 6 mois"
      },
      rating: 5
    },
    {
      content: "Les écouteurs bluetooth que j'ai achetés ont une excellente qualité sonore et tiennent bien la charge. Le service client a également été très réactif quand j'ai eu une question.",
      author: {
        name: "Julie L.",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        info: "Client depuis 3 mois"
      },
      rating: 4
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold font-heading text-center mb-8">Ce que disent nos clients</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <div className="flex items-center text-yellow-400 text-sm mb-4">
                {Array(testimonial.rating).fill(0).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400" />
                ))}
                {Array(5 - testimonial.rating).fill(0).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.author.avatar} 
                  alt={testimonial.author.name} 
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h4 className="font-medium">{testimonial.author.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.author.info}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
