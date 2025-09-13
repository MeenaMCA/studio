import { Sparkles } from "lucide-react";

export function AppHeader() {
  return (
    <header className="py-6 px-4 md:px-6">
      <div className="container mx-auto flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-accent mr-3" />
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
          SparkleTasks
        </h1>
      </div>
    </header>
  );
}
