export default function PromoBanners() {
  return (
    <section className="py-12 bg-background">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="relative aspect-square bg-primary rounded-lg flex items-center justify-center">
               <h2 className="text-2xl font-bold text-primary-foreground">Banner</h2>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
