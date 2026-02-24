export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 py-10">
      <div className="container mx-auto px-4 text-center">
        <p className="font-display text-xl text-foreground mb-2">OTAKU VERSE</p>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Otaku Vault. All rights reserved.
        </p>
      </div>
    </footer>);

};