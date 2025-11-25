import { Gem } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2 text-lg font-bold">
      <div className="p-2 bg-primary rounded-md">
        <Gem className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        Ouro Gráfica
      </span>
    </div>
  );
}
