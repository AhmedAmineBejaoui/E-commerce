import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category } from "shared/src/schema.ts";
import { Skeleton } from "../../components/ui/skeleton";

export default function CategoriesSection() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold font-heading text-center mb-8">Catégories populaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-md">
                <Skeleton className="aspect-square" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold font-heading text-center mb-8">Catégories populaires</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories?.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <a className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="aspect-square bg-gray-200 relative">
                  <img 
                    src={category.imageUrl || `https://images.unsplash.com/photo-1600086427699-bfffb4793d29?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80`}
                    alt={category.name} 
                    className="w-full h-full object-cover transition group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 text-white font-medium text-lg">{category.name}</h3>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
