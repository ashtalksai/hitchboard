"use client";

import { useEffect, useState, use } from "react";
import { Plus, Phone, Mail, Trash2, Edit2, Save, X, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Vendor = {
  id: string;
  name: string;
  role: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
};

export default function VendorsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: weddingId } = use(params);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", phone: "", email: "", notes: "" });

  useEffect(() => {
    fetch(`/api/weddings/${weddingId}/vendors`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setVendors(data); })
      .finally(() => setLoading(false));
  }, [weddingId]);

  async function addVendor(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/weddings/${weddingId}/vendors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const vendor = await res.json();
    setVendors((prev) => [...prev, vendor]);
    setForm({ name: "", role: "", phone: "", email: "", notes: "" });
    setOpen(false);
  }

  async function updateVendor(vendorId: string) {
    const res = await fetch(`/api/weddings/${weddingId}/vendors/${vendorId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    setVendors((prev) => prev.map((v) => (v.id === vendorId ? updated : v)));
    setEditingId(null);
    setForm({ name: "", role: "", phone: "", email: "", notes: "" });
  }

  async function deleteVendor(vendorId: string) {
    await fetch(`/api/weddings/${weddingId}/vendors/${vendorId}`, { method: "DELETE" });
    setVendors((prev) => prev.filter((v) => v.id !== vendorId));
  }

  function startEdit(vendor: Vendor) {
    setEditingId(vendor.id);
    setForm({
      name: vendor.name,
      role: vendor.role ?? "",
      phone: vendor.phone ?? "",
      email: vendor.email ?? "",
      notes: vendor.notes ?? "",
    });
  }

  return (
    <AppShell weddingId={weddingId}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">Vendors</h1>
            <p className="text-sm text-muted-foreground">Your vendor contacts</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-sage hover:bg-sage-dark text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-heading">Add Vendor</DialogTitle>
              </DialogHeader>
              <form onSubmit={addVendor} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      placeholder="Vendor name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                      placeholder="e.g. Florist"
                      value={form.role}
                      onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="vendor@email.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Any important notes..."
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  />
                </div>
                <Button type="submit" className="w-full bg-sage hover:bg-sage-dark text-white">
                  Add Vendor
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sage border-t-transparent" />
          </div>
        ) : vendors.length === 0 ? (
          <Card className="border-dashed border-2 shadow-none">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-heading text-lg font-semibold">No vendors yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Add your first vendor contact</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => (
              <Card key={vendor.id} className="border-border/50 shadow-none">
                <CardContent className="p-4">
                  {editingId === vendor.id ? (
                    <div className="space-y-3">
                      <Input
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Name"
                      />
                      <Input
                        value={form.role}
                        onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                        placeholder="Role"
                      />
                      <Input
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="Phone"
                      />
                      <Input
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="Email"
                      />
                      <Textarea
                        value={form.notes}
                        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                        placeholder="Notes"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateVendor(vendor.id)} className="bg-sage hover:bg-sage-dark text-white">
                          <Save className="mr-1 h-3 w-3" /> Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          <X className="mr-1 h-3 w-3" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{vendor.name}</h3>
                          {vendor.role && <Badge variant="secondary" className="mt-1 text-xs">{vendor.role}</Badge>}
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => startEdit(vendor)} className="h-8 w-8">
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteVendor(vendor.id)} className="h-8 w-8 text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1">
                        {vendor.phone && (
                          <a href={`tel:${vendor.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                            <Phone className="h-3 w-3" /> {vendor.phone}
                          </a>
                        )}
                        {vendor.email && (
                          <a href={`mailto:${vendor.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                            <Mail className="h-3 w-3" /> {vendor.email}
                          </a>
                        )}
                      </div>
                      {vendor.notes && (
                        <p className="mt-2 text-xs text-muted-foreground border-t pt-2">{vendor.notes}</p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
