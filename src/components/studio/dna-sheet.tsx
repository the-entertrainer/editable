import { Aperture } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { HEISTY_DNA } from "@/lib/editable/heisty-dna";

const SECTIONS = [
  { title: "Juxtaposition", items: HEISTY_DNA.pillars.juxtaposition },
  { title: "Rhythm", items: HEISTY_DNA.pillars.rhythm },
  { title: "Camera", items: HEISTY_DNA.pillars.camera },
  { title: "Audio", items: HEISTY_DNA.pillars.audio },
] as const;

export function DnaSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          <Aperture />
          DNA
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Heisty DNA</SheetTitle>
          <SheetDescription>
            {HEISTY_DNA.masterwork}. {HEISTY_DNA.duration}. {HEISTY_DNA.software}.
          </SheetDescription>
        </SheetHeader>
        <p className="mb-6 font-display text-xl leading-snug text-fg">
          The hidden thread is semantic gravity plus kinetic rhyme — never visual similarity.
        </p>
        <div className="space-y-6">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="border-l border-border pl-3 text-sm leading-relaxed text-fg/90">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
