import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulating subscription success
    setTimeout(() => {
      toast({
        title: "Inscription réussie !",
        description: "Merci de vous être inscrit à notre newsletter.",
        variant: "default",
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-12 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold font-heading text-white mb-3">
            Restez informé de nos nouveautés
          </h2>
          <p className="text-white/80 mb-6">
            Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives et les dernières actualités.
          </p>
          <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Votre adresse email" 
              className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white border-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-lg transition shadow-lg disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </form>
          <p className="text-white/60 text-sm mt-4">
            Nous respectons votre vie privée. Désabonnez-vous à tout moment.
          </p>
        </div>
      </div>
    </section>
  );
}
