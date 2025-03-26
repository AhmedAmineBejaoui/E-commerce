import { Link } from "wouter";

export default function SpecialOfferBanner() {
  return (
    <section className="bg-gradient-to-r from-orange-500 to-orange-400 py-10 my-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-white text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-2xl font-bold font-heading mb-2">Offre Spéciale</h2>
            <p className="text-white/90 mb-4">Obtenez 15% de réduction sur toute la gamme d'écouteurs bluetooth!</p>
            <span className="text-xl font-bold bg-white text-orange-500 px-3 py-1 rounded-lg">CODE: SOUND15</span>
          </div>
          <div>
            <Link href="/category/ecouteurs-audio">
              <a className="bg-white text-orange-500 hover:bg-gray-100 font-medium px-6 py-3 rounded-lg transition shadow-lg">
                En profiter maintenant
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
