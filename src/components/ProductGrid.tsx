import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { Loader2 } from "lucide-react";

export const ProductGrid = () => {
  const { data: products, isLoading, error } = useProducts();

  return (
    <section id="products" className="container mx-auto px-4 py-16">
      <h2 className="font-display text-4xl md:text-5xl text-foreground text-glow mb-10 text-center">
        LATEST FIGURES
      </h2>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <p className="text-center text-destructive py-10">Failed to load products</p>
      )}

      {products && products.length === 0 && (
        <p className="text-center text-muted-foreground py-20 text-lg">
          No products found. Check back soon!
        </p>
      )}

      {products && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.node.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
