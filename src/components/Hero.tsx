import heroBanner from "@/assets/hero-banner.jpg";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Premium anime figure collection display"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      </div>
      <div className="relative z-10 text-center px-4">
        <h1 className="font-display text-6xl md:text-8xl text-foreground text-glow-pink mb-4">
          OTAKU VAULT
        </h1>
        <p className="text-lg md:text-xl text-secondary-foreground max-w-xl mx-auto mb-8">
          Premium anime figures & collectibles for true fans
        </p>
        <Button
          onClick={scrollToProducts}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-lg tracking-wider px-8"
        >
          BROWSE COLLECTION
        </Button>
      </div>
    </section>
  );
};
