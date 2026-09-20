"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductNotesTabsProps {
  description?: string | null;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
}

function NoteGroups({
  topNotes,
  heartNotes,
  baseNotes,
}: Pick<ProductNotesTabsProps, "topNotes" | "heartNotes" | "baseNotes">) {
  const groups = [
    { label: "Top Notes", notes: topNotes },
    { label: "Heart Notes", notes: heartNotes },
    { label: "Base Notes", notes: baseNotes },
  ].filter((group) => group.notes.length > 0);

  return (
    <div className="flex flex-col gap-3">
      {groups.map(({ label, notes }) => (
        <div key={label}>
          <p className="text-foreground mb-1.5 text-sm font-semibold">{label}</p>
          <div className="flex flex-wrap gap-1.5">
            {notes.map((note) => (
              <Badge key={note} variant="secondary">
                {note}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductNotesTabs({
  description,
  topNotes,
  heartNotes,
  baseNotes,
}: ProductNotesTabsProps) {
  const hasNotes = topNotes.length > 0 || heartNotes.length > 0 || baseNotes.length > 0;
  const hasDescription = Boolean(description);

  if (!hasDescription && !hasNotes) return null;

  if (hasDescription && !hasNotes) {
    return (
      <p className="text-muted-foreground text-sm leading-relaxed text-pretty">{description}</p>
    );
  }

  if (!hasDescription && hasNotes) {
    return <NoteGroups topNotes={topNotes} heartNotes={heartNotes} baseNotes={baseNotes} />;
  }

  return (
    <Tabs defaultValue="description">
      <TabsList>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="description">
        <p className="text-muted-foreground text-sm leading-relaxed text-pretty">{description}</p>
      </TabsContent>
      <TabsContent value="notes">
        <NoteGroups topNotes={topNotes} heartNotes={heartNotes} baseNotes={baseNotes} />
      </TabsContent>
    </Tabs>
  );
}
