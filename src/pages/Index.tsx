import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <Hero />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
