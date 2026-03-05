import Link from "next/link";
import {
  Clock,
  CheckSquare,
  Users,
  Calendar,
  Heart,
  Shield,
  Smartphone,
  Star,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Clock,
    title: "Timeline Builder",
    description: "Drag-and-drop day-of schedule. Ceremony, photos, reception — mapped minute by minute.",
  },
  {
    icon: CheckSquare,
    title: "Task Board",
    description: "Kanban-style task management. Assign tasks to coordinators and track progress in real time.",
  },
  {
    icon: Users,
    title: "Vendor Hub",
    description: "All vendor contacts in one place. Names, phones, notes — accessible even offline.",
  },
  {
    icon: Calendar,
    title: "Guest Info Page",
    description: "Shareable link for guests with schedule and venue info. No login required.",
  },
  {
    icon: Shield,
    title: "Coordinator Roles",
    description: "Invite your team. Assign roles so everyone knows their responsibilities on the big day.",
  },
  {
    icon: Smartphone,
    title: "Works Offline",
    description: "PWA with offline support. Your timeline and tasks are available even without signal.",
  },
];

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for simple weddings",
    features: ["1 wedding", "Timeline builder", "Task board", "Up to 3 coordinators", "Guest info page"],
    cta: "Get Started",
    href: "/auth/signup",
    highlighted: false,
  },
  {
    name: "Standard",
    price: "$49",
    priceNote: "one-time",
    description: "For weddings that need more",
    features: [
      "Everything in Free",
      "Unlimited coordinators",
      "Vendor contact hub",
      "Priority support",
      "Custom branding",
    ],
    cta: "Upgrade",
    href: "/auth/signup?tier=standard",
    highlighted: true,
  },
  {
    name: "Premium",
    price: "$99",
    priceNote: "one-time",
    description: "The full experience",
    features: [
      "Everything in Standard",
      "Multiple weddings",
      "Timeline templates",
      "Export to PDF",
      "Dedicated support",
    ],
    cta: "Go Premium",
    href: "/auth/signup?tier=premium",
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-cream/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-sage" />
            <span className="font-heading text-xl font-bold text-sage-dark">Hitchboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-sage hover:bg-sage-dark text-white">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 bg-sage/10 text-sage-dark border-sage/20">
              <Star className="mr-1 h-3 w-3" /> Built for micro-weddings
            </Badge>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Your wedding day,{" "}
              <span className="text-sage">handled.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              The day-of coordination app for micro-weddings. Timeline, tasks, vendors, and guest info —
              everything the designated friend coordinator needs, in one calm, beautiful place.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-sage hover:bg-sage-dark text-white px-8 h-12 text-base">
                  Start Planning Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-12 text-base">
                  See Features
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Free forever for simple weddings. No credit card required.
            </p>
          </div>
        </div>
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-sage/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-rose-gold/5 blur-3xl" />
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/50 bg-white py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Everything you need for the big day
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No bloat. No overwhelm. Just the tools a coordinator actually needs.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50 bg-cream/50 shadow-none">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage/10">
                    <feature.icon className="h-5 w-5 text-sage" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border/50 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Simple, one-time pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Pay once per wedding. No subscriptions, no surprises.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative flex flex-col shadow-none ${
                  tier.highlighted
                    ? "border-sage bg-white ring-2 ring-sage/20"
                    : "border-border/50 bg-white"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-sage text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <div className="mt-2">
                    <span className="font-heading text-4xl font-bold">{tier.price}</span>
                    {tier.priceNote && (
                      <span className="ml-1 text-sm text-muted-foreground">/{tier.priceNote}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 mt-0.5 text-sage flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Link href={tier.href}>
                    <Button
                      className={`w-full ${
                        tier.highlighted
                          ? "bg-sage hover:bg-sage-dark text-white"
                          : ""
                      }`}
                      variant={tier.highlighted ? "default" : "outline"}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50 bg-sage py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            Ready to coordinate with confidence?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Join thousands of coordinators making micro-wedding days run smoothly.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="mt-8 bg-white text-sage-dark hover:bg-cream h-12 text-base px-8">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-sage" />
              <span className="font-heading text-lg font-bold text-sage-dark">Hitchboard</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Hitchboard. Made with love for micro-weddings.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
