"use client";

import { useEffect, useState, use } from "react";
import { Plus, GripVertical, Trash2, Edit2, Save, X, Clock } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

type TimelineItem = {
  id: string;
  title: string;
  time: string;
  duration: number | null;
  notes: string | null;
  order: number;
};

export default function TimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: weddingId } = use(params);
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", time: "", duration: "", notes: "" });

  useEffect(() => {
    fetch(`/api/weddings/${weddingId}/timeline`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setItems(data); })
      .finally(() => setLoading(false));
  }, [weddingId]);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/weddings/${weddingId}/timeline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        time: form.time,
        duration: form.duration ? parseInt(form.duration) : null,
        notes: form.notes || null,
        order: items.length,
      }),
    });
    const item = await res.json();
    setItems((prev) => [...prev, item]);
    setForm({ title: "", time: "", duration: "", notes: "" });
    setOpen(false);
  }

  async function updateItem(itemId: string) {
    const res = await fetch(`/api/weddings/${weddingId}/timeline/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        time: form.time,
        duration: form.duration ? parseInt(form.duration) : null,
        notes: form.notes || null,
      }),
    });
    const updated = await res.json();
    setItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)));
    setEditingId(null);
    setForm({ title: "", time: "", duration: "", notes: "" });
  }

  async function deleteItem(itemId: string) {
    await fetch(`/api/weddings/${weddingId}/timeline/${itemId}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }

  async function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    const updated = reordered.map((item, idx) => ({ ...item, order: idx }));
    setItems(updated);

    await fetch(`/api/weddings/${weddingId}/timeline`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated.map((i) => ({ id: i.id, order: i.order }))),
    });
  }

  function startEdit(item: TimelineItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      time: item.time,
      duration: item.duration?.toString() ?? "",
      notes: item.notes ?? "",
    });
  }

  return (
    <AppShell weddingId={weddingId}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">Timeline</h1>
            <p className="text-sm text-muted-foreground">Drag to reorder your day-of schedule</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-sage hover:bg-sage-dark text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-heading">Add Timeline Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={addItem} className="space-y-4">
                <div className="space-y-2">
                  <Label>Event</Label>
                  <Input
                    placeholder="e.g. Ceremony begins"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (min)</Label>
                    <Input
                      type="number"
                      placeholder="30"
                      value={form.duration}
                      onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Any details..."
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  />
                </div>
                <Button type="submit" className="w-full bg-sage hover:bg-sage-dark text-white">
                  Add Event
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sage border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <Card className="border-dashed border-2 shadow-none">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-heading text-lg font-semibold">No events yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Add your first timeline event</p>
            </CardContent>
          </Card>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="timeline">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`rounded-lg border bg-white p-4 transition-shadow ${
                            snapshot.isDragging ? "shadow-lg ring-2 ring-sage/20" : "shadow-none"
                          }`}
                        >
                          {editingId === item.id ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <Input
                                  value={form.title}
                                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                  placeholder="Event name"
                                />
                                <Input
                                  type="time"
                                  value={form.time}
                                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <Input
                                  type="number"
                                  placeholder="Duration (min)"
                                  value={form.duration}
                                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                                />
                                <Input
                                  placeholder="Notes"
                                  value={form.notes}
                                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => updateItem(item.id)} className="bg-sage hover:bg-sage-dark text-white">
                                  <Save className="mr-1 h-3 w-3" /> Save
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                  <X className="mr-1 h-3 w-3" /> Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div {...provided.dragHandleProps} className="cursor-grab text-muted-foreground">
                                <GripVertical className="h-5 w-5" />
                              </div>
                              <div className="flex h-10 w-16 items-center justify-center rounded-md bg-sage/10 text-sm font-medium text-sage-dark">
                                {item.time}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium">{item.title}</p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  {item.duration && <span>{item.duration} min</span>}
                                  {item.notes && <span className="truncate">{item.notes}</span>}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button size="icon" variant="ghost" onClick={() => startEdit(item)} className="h-8 w-8">
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => deleteItem(item.id)} className="h-8 w-8 text-destructive">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </AppShell>
  );
}
