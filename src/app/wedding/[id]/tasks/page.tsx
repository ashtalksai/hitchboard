"use client";

import { useEffect, useState, use } from "react";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

type Task = {
  id: string;
  title: string;
  status: string;
  assignedTo: string | null;
};

const columns = [
  { id: "todo", title: "To Do", color: "bg-muted" },
  { id: "doing", title: "Doing", color: "bg-sage/10" },
  { id: "done", title: "Done", color: "bg-rose-gold/10" },
];

export default function TasksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: weddingId } = use(params);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", assignedTo: "" });

  useEffect(() => {
    fetch(`/api/weddings/${weddingId}/tasks`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setTasks(data); })
      .finally(() => setLoading(false));
  }, [weddingId]);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/weddings/${weddingId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        assignedTo: form.assignedTo || null,
        status: "todo",
      }),
    });
    const task = await res.json();
    setTasks((prev) => [...prev, task]);
    setForm({ title: "", assignedTo: "" });
    setOpen(false);
  }

  async function updateTask(taskId: string, updates: Partial<Task>) {
    const res = await fetch(`/api/weddings/${weddingId}/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const updated = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
  }

  async function deleteTask(taskId: string) {
    await fetch(`/api/weddings/${weddingId}/tasks/${taskId}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    updateTask(taskId, { status: newStatus });
  }

  function startEdit(task: Task) {
    setEditingId(task.id);
    setForm({ title: task.title, assignedTo: task.assignedTo ?? "" });
  }

  function saveEdit(taskId: string) {
    updateTask(taskId, { title: form.title, assignedTo: form.assignedTo || null });
    setEditingId(null);
    setForm({ title: "", assignedTo: "" });
  }

  return (
    <AppShell weddingId={weddingId}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">Task Board</h1>
            <p className="text-sm text-muted-foreground">Drag tasks between columns</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-sage hover:bg-sage-dark text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-heading">Add Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={addTask} className="space-y-4">
                <div className="space-y-2">
                  <Label>Task</Label>
                  <Input
                    placeholder="e.g. Set up ceremony chairs"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assigned to</Label>
                  <Input
                    placeholder="e.g. Sarah"
                    value={form.assignedTo}
                    onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))}
                  />
                </div>
                <Button type="submit" className="w-full bg-sage hover:bg-sage-dark text-white">
                  Add Task
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sage border-t-transparent" />
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid gap-4 lg:grid-cols-3">
              {columns.map((col) => {
                const colTasks = tasks.filter((t) => t.status === col.id);
                return (
                  <div key={col.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{col.title}</h3>
                      <Badge variant="secondary" className="text-xs">{colTasks.length}</Badge>
                    </div>
                    <Droppable droppableId={col.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-[200px] rounded-lg border-2 border-dashed p-2 transition-colors ${
                            snapshot.isDraggingOver ? "border-sage bg-sage/5" : "border-border"
                          }`}
                        >
                          {colTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`mb-2 rounded-md border bg-white p-3 transition-shadow ${
                                    snapshot.isDragging ? "shadow-lg" : "shadow-none"
                                  }`}
                                >
                                  {editingId === task.id ? (
                                    <div className="space-y-2">
                                      <Input
                                        value={form.title}
                                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                        className="h-8 text-sm"
                                      />
                                      <Input
                                        placeholder="Assigned to"
                                        value={form.assignedTo}
                                        onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))}
                                        className="h-8 text-sm"
                                      />
                                      <div className="flex gap-1">
                                        <Button size="sm" onClick={() => saveEdit(task.id)} className="h-7 text-xs bg-sage hover:bg-sage-dark text-white">
                                          <Save className="mr-1 h-3 w-3" /> Save
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="h-7 text-xs">
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <p className="text-sm font-medium">{task.title}</p>
                                      {task.assignedTo && (
                                        <p className="mt-1 text-xs text-muted-foreground">{task.assignedTo}</p>
                                      )}
                                      <div className="mt-2 flex gap-1">
                                        <Button size="icon" variant="ghost" onClick={() => startEdit(task)} className="h-6 w-6">
                                          <Edit2 className="h-3 w-3" />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => deleteTask(task.id)} className="h-6 w-6 text-destructive">
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        )}
      </div>
    </AppShell>
  );
}
