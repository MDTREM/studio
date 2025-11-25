export default function TopBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-primary text-primary-foreground text-center p-2 text-sm font-medium">
      {children}
    </div>
  );
}