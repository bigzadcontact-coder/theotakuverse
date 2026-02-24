import { Link } from "react-router-dom";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const firstVariant = node.variants.edges[0]?.node;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant) return;
    await addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
    });
    toast.success("Added to cart!", { position: "top-center" });
  };

  return (
    <Link
      to={`/product/${node.handle}`}
      className="group block rounded-lg bg-card overflow-hidden card-glow transition-all duration-300"
    >
      <div className="aspect-square overflow-hidden bg-secondary">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || node.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-medium text-sm text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {node.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-accent">
            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isLoading || !firstVariant}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Link>
  );
};
