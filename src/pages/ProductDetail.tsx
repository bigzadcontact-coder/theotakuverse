import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { storefrontApiRequest, STOREFRONT_PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['shopify-product', handle],
    queryFn: async () => {
      const data = await storefrontApiRequest(STOREFRONT_PRODUCT_BY_HANDLE_QUERY, { handle });
      return data?.data?.productByHandle;
    },
    enabled: !!handle,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-muted-foreground text-lg">Product not found</p>
          <Link to="/">
            <Button variant="outline" className="border-border">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images.edges;
  const variants = product.variants.edges;
  const selectedVariant = variants[selectedVariantIndex]?.node;
  const selectedImage = images[selectedImageIndex]?.node;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Added to cart!", { position: "top-center" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-10">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Shop
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-card card-glow">
                {selectedImage ? (
                  <img src={selectedImage.url} alt={selectedImage.altText || product.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">No Image</div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img: { node: { url: string; altText: string | null } }, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
                        i === selectedImageIndex ? 'border-primary' : 'border-border'
                      }`}
                    >
                      <img src={img.node.url} alt={img.node.altText || ''} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <h1 className="font-display text-3xl md:text-4xl text-foreground">{product.title}</h1>
              <p className="text-2xl font-bold text-accent">
                {selectedVariant?.price.currencyCode} {parseFloat(selectedVariant?.price.amount || '0').toFixed(2)}
              </p>

              {product.options?.length > 0 && product.options.some((o: { name: string; values: string[] }) => o.name !== 'Title') && (
                <div className="space-y-4">
                  {product.options.filter((o: { name: string }) => o.name !== 'Title').map((option: { name: string; values: string[] }) => (
                    <div key={option.name}>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">{option.name}</label>
                      <div className="flex flex-wrap gap-2">
                        {variants.map((v: { node: { id: string; title: string; selectedOptions: Array<{ name: string; value: string }> } }, i: number) => {
                          const opt = v.node.selectedOptions.find((so) => so.name === option.name);
                          if (!opt) return null;
                          // Deduplicate
                          const prevVariants = variants.slice(0, i);
                          const isDuplicate = prevVariants.some((pv: { node: { selectedOptions: Array<{ name: string; value: string }> } }) =>
                            pv.node.selectedOptions.find(so => so.name === option.name)?.value === opt.value
                          );
                          if (isDuplicate) return null;

                          return (
                            <button
                              key={`${option.name}-${opt.value}`}
                              onClick={() => {
                                const idx = variants.findIndex((vi: { node: { selectedOptions: Array<{ name: string; value: string }> } }) =>
                                  vi.node.selectedOptions.find(so => so.name === option.name)?.value === opt.value
                                );
                                if (idx >= 0) setSelectedVariantIndex(idx);
                              }}
                              className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                                selectedVariant?.selectedOptions.find(so => so.name === option.name)?.value === opt.value
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                              }`}
                            >
                              {opt.value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                disabled={isCartLoading || !selectedVariant?.availableForSale}
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display text-lg tracking-wider"
              >
                {isCartLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : !selectedVariant?.availableForSale ? (
                  'Sold Out'
                ) : (
                  <><ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart</>
                )}
              </Button>

              {product.description && (
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                  <p className="text-secondary-foreground leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
