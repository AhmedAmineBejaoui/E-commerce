import { useParams } from "wouter";
import ProductDetail from "@/components/product/ProductDetail";

export default function ProductDetailPage() {
  const { slug } = useParams();
  
  if (!slug) {
    return <div>Produit introuvable</div>;
  }

  return <ProductDetail slug={slug} />;
}
