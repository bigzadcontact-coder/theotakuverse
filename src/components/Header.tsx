import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="font-display text-2xl tracking-wider text-foreground hover:text-primary transition-colors">
          OTAKU VAULT
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Shop
          </Link>
          <CartDrawer />
        </nav>
      </div>
    </header>
  );
};
