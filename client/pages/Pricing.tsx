import { Link, useNavigate } from "@/lib/router-compat";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle } from "lucide-react";
import { StaggerList } from "@/components/StaggerList";
import { useTranslations } from "next-intl";

export default function Pricing() {
  const navigate = useNavigate();
  const t = useTranslations("Pricing");
  return (
    <div className="min-h-screen bg-transparent text-foreground">

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[1280px] mx-auto text-center space-y-8">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-5xl font-bold">{t("title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          <StaggerList staggerDelay={0.15} className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { key: "starter", highlighted: false },
              { key: "professional", highlighted: true },
              { key: "enterprise", highlighted: false },
            ].map((plan, i) => (
              <Card
                key={i}
                variant={plan.highlighted ? "gradient" : "default"}
                className={`p-8 rounded-3xl transition-all ${
                  plan.highlighted ? "lg:scale-105 border-primary/40" : "border-border/40"
                } hover:shadow-xl hover:-translate-y-2`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">{t(`plans.${plan.key}.name`)}</h3>
                  {plan.highlighted && <Badge>{t("popular")}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mb-6">{t(`plans.${plan.key}.description`)}</p>
                <div className="text-4xl font-bold mb-8">
                  {t(`plans.${plan.key}.price`)}
                  {plan.key !== "enterprise" && <span className="text-lg text-muted-foreground">{t("perMonth")}</span>}
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  {Array.from({ length: plan.key === "enterprise" ? 5 : plan.key === "professional" ? 4 : 3 }, (_, j) => (
                    <li key={j} className="text-muted-foreground flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      {t(`plans.${plan.key}.features.${j}`)}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlighted ? "primary" : "outline"}
                  size="md"
                  className={`w-full ${
                    !plan.highlighted &&
                    "!bg-[#E8F0E8] !border-[#10A968]/40 !text-[#2D4D35] hover:!bg-[#D4E8D8]"
                  }`}
                  onClick={() => navigate("/tools")}
                >
                  {t("getStarted")}
                </Button>
              </Card>
            ))}
          </StaggerList>

          <div className="mt-16 space-y-4 premium-card p-8 rounded-3xl border border-border/40 animate-fade-in-scale">
            <h2 className="text-2xl font-bold">{t("customPlanTitle")}</h2>
            <p className="text-muted-foreground">{t("customPlanDescription")}</p>
            <Button onClick={() => navigate("/contact-us")} size="md">
              {t("contactSales")}
            </Button>
          </div>
        </div>
      </main>

    </div>
  );
}
