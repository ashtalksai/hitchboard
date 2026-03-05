"use client";

import { useEffect, useState, use } from "react";
import { Heart, MapPin, Calendar, Clock, Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type GuestInfo = {
  wedding: {
    name: string;
    date: string | null;
    venue: string | null;
  };
  timeline: {
    title: string;
    time: string;
    duration: number | null;
    notes: string | null;
  }[];
};

export default function GuestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: weddingId } = use(params);
  const [info, setInfo] = useState<GuestInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/weddings/${weddingId}/guest-info`)
      .then((r) => r.json())
      .then(setInfo)
      .finally(() => setLoading(false));
  }, [weddingId]);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sage border-t-transparent" />
      </div>
    );
  }

  if (!info || !info.wedding) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-muted-foreground">Wedding not found</p>
      </div>
    );
  }

  const { wedding, timeline } = info;
  const weddingDate = wedding.date ? new Date(wedding.date) : null;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-sage py-16 text-center text-white">
        <Heart className="mx-auto h-8 w-8 mb-4 opacity-80" />
        <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
          {wedding.name}
        </h1>
        {weddingDate && (
          <p className="mt-3 flex items-center justify-center gap-2 text-lg text-white/80">
            <Calendar className="h-4 w-4" />
            {weddingDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
        {wedding.venue && (
          <p className="mt-2 flex items-center justify-center gap-2 text-white/70">
            <MapPin className="h-4 w-4" />
            {wedding.venue}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 py-12">
        {/* Share button */}
        <div className="mb-8 flex justify-center">
          <Button variant="outline" onClick={copyLink} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {copied ? "Link Copied!" : "Share This Page"}
          </Button>
        </div>

        {/* Schedule */}
        {timeline.length > 0 && (
          <div>
            <h2 className="font-heading text-2xl font-bold text-center mb-8">Schedule</h2>
            <div className="space-y-3">
              {timeline.map((item, i) => (
                <Card key={i} className="shadow-none border-border/50">
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="flex h-12 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-sage/10">
                      <div className="text-center">
                        <Clock className="mx-auto h-4 w-4 text-sage mb-0.5" />
                        <span className="text-xs font-medium text-sage-dark">{item.time}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        {item.duration && <span>{item.duration} minutes</span>}
                      </div>
                      {item.notes && (
                        <p className="mt-1 text-sm text-muted-foreground">{item.notes}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Venue info */}
        {wedding.venue && (
          <div className="mt-12 text-center">
            <h2 className="font-heading text-2xl font-bold mb-4">Venue</h2>
            <Card className="shadow-none border-border/50">
              <CardContent className="p-6">
                <MapPin className="mx-auto h-6 w-6 text-sage mb-2" />
                <p className="font-medium">{wedding.venue}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <Heart className="mx-auto h-5 w-5 text-rose-gold mb-2" />
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-heading font-semibold text-sage-dark">Hitchboard</span>
          </p>
        </div>
      </div>
    </div>
  );
}
