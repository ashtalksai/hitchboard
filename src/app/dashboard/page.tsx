"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Calendar,
  Clock,
  CheckSquare,
  Users,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Wedding = {
  id: string;
  name: string;
  date: string | null;
  venue: string | null;
  tier: string;
};

export default function DashboardPage() {
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", date: "", venue: "" });
  const router = useRouter();

  useEffect(() => {
    fetch("/api/weddings")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setWeddings(data); })
      .finally(() => setLoading(false));
  }, []);

  async function createWedding(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/weddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const wedding = await res.json();
      setWeddings((prev) => [...prev, wedding]);
      setForm({ name: "", date: "", venue: "" });
      setOpen(false);
      router.push(`/wedding/${wedding.id}/timeline`);
    } finally {
      setCreating(false);
    }
  }

  function daysUntil(date: string | null) {
    if (!date) return null;
    const d = new Date(date);
    const now = new Date();
    const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold lg:text-3xl">Dashboard</h1>
            <p className="text-muted-foreground">Manage your weddings</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-sage hover:bg-sage-dark text-white">
                <Plus className="mr-2 h-4 w-4" /> New Wedding
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-heading">Create a Wedding</DialogTitle>
              </DialogHeader>
              <form onSubmit={createWedding} className="space-y-4">
                <div className="space-y-2">
                  <Label>Wedding Name</Label>
                  <Input
                    placeholder="Sarah & Alex's Wedding"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Venue</Label>
                  <Input
                    placeholder="Venue name or address"
                    value={form.venue}
                    onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
                  />
                </div>
                <Button type="submit" className="w-full bg-sage hover:bg-sage-dark text-white" disabled={creating}>
                  {creating ? "Creating..." : "Create Wedding"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sage border-t-transparent" />
          </div>
        ) : weddings.length === 0 ? (
          <Card className="border-dashed border-2 border-border shadow-none">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-heading text-lg font-semibold">No weddings yet</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Create your first wedding to get started
              </p>
              <Button onClick={() => setOpen(true)} className="bg-sage hover:bg-sage-dark text-white">
                <Plus className="mr-2 h-4 w-4" /> Create Wedding
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {weddings.map((wedding) => {
              const days = daysUntil(wedding.date);
              return (
                <Card key={wedding.id} className="group border-border/50 shadow-none hover:border-sage/30 transition-colors">
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">{wedding.name}</CardTitle>
                    {wedding.venue && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {wedding.venue}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {days !== null && (
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage/10">
                          <Calendar className="h-5 w-5 text-sage" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-sage">{days}</p>
                          <p className="text-xs text-muted-foreground">{days > 0 ? "days to go" : days === 0 ? "Today!" : "days ago"}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Link href={`/wedding/${wedding.id}/timeline`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Clock className="mr-1 h-3 w-3" /> Timeline
                        </Button>
                      </Link>
                      <Link href={`/wedding/${wedding.id}/tasks`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <CheckSquare className="mr-1 h-3 w-3" /> Tasks
                        </Button>
                      </Link>
                      <Link href={`/wedding/${wedding.id}/vendors`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Users className="mr-1 h-3 w-3" /> Vendors
                        </Button>
                      </Link>
                    </div>
                    <Link
                      href={`/wedding/${wedding.id}/timeline`}
                      className="flex items-center justify-center gap-1 text-sm font-medium text-sage hover:text-sage-dark transition-colors"
                    >
                      Open Wedding <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
