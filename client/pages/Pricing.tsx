import { Link, useNavigate } from "@/lib/router-compat";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle } from "lucide-react";
import { StaggerList } from "@/components/StaggerList";

export default function Pricing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-transparent text-foreground">

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[1280px] mx-auto text-center space-y-8">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-5xl font-bold">Pricing Plans</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan. All plans include enterprise-grade security and reliability.
            </p>
          </div>

          <StaggerList staggerDelay={0.15} className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                name: "Starter",
                price: "Free",
                desc: "Perfect for getting started",
                features: ["Up to 100 QR codes/month", "Basic customization", "Standard support"],
              },
              {
                name: "Professional",
                price: "$99",
                desc: "Best for growing businesses",
                features: ["Up to 1,000 QR codes/month", "Advanced customization", "Priority support", "Analytics dashboard"],
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                desc: "For large-scale operations",
                features: ["Unlimited QR codes", "Full customization", "Dedicated support", "Advanced analytics", "API access"],
              },
            ].map((plan, i) => (
              <Card
                key={i}
                variant={plan.highlighted ? "gradient" : "default"}
                className={`p-8 rounded-3xl transition-all ${
                  plan.highlighted ? "lg:scale-105 border-primary/40" : "border-border/40"
                } hover:shadow-xl hover:-translate-y-2`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  {plan.highlighted && <Badge>Popular</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>
                <div className="text-4xl font-bold mb-8">
                  {plan.price}
                  {plan.price !== "Custom" && <span className="text-lg text-muted-foreground">/mo</span>}
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="text-muted-foreground flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlighted ? "primary" : "outline"}
                  size="md"
                  className="w-full"
                  onClick={() => navigate("/tools")}
                >
                  Get Started
                </Button>
              </Card>
            ))}
          </StaggerList>

          <div className="mt-16 space-y-4 premium-card p-8 rounded-3xl border border-border/40 animate-fade-in-scale">
            <h2 className="text-2xl font-bold">Need a custom plan?</h2>
            <p className="text-muted-foreground">Contact our sales team for enterprise solutions tailored to your needs.</p>
            <Button onClick={() => navigate("/contact-us")} size="md">
              Contact Sales
            </Button>
          </div>
        </div>
      </main>

    </div>
  );
}
