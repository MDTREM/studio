export default function TopBanner({ text }: { text: string }) {
  return (
    <div className="bg-primary text-primary-foreground text-center p-2 text-sm font-medium">
      {text}
    </div>
  );
}
