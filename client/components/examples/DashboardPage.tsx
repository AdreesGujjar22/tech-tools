import React from "react";
import { PageTransition } from "@/components/PageTransition";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { StaggerList } from "@/components/StaggerList";
import { GradientDivider } from "@/components/ui/GradientDivider";
import { BarChart3, TrendingUp, Users, Zap, ArrowUp, ArrowDown } from "lucide-react";

// Example: Modern dashboard page structure
export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="space-y-12">
        {/* Page Header */}
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your performance overview for this week.
          </p>
        </div>

        {/* Stat Cards Grid */}
        <StaggerList staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Users"
            value="12,345"
            icon={<Users className="w-6 h-6" />}
            change={{ value: 12, type: "increase" }}
            gradient="indigo"
          />
          <StatCard
            label="Revenue"
            value="$45,600"
            icon={<Zap className="w-6 h-6" />}
            change={{ value: 8, type: "increase" }}
            gradient="emerald"
          />
          <StatCard
            label="Growth Rate"
            value="23.5%"
            icon={<TrendingUp className="w-6 h-6" />}
            change={{ value: 3, type: "decrease" }}
            gradient="blue"
          />
          <StatCard
            label="Performance"
            value="98.2%"
            icon={<BarChart3 className="w-6 h-6" />}
            change={{ value: 2, type: "increase" }}
            gradient="purple"
          />
        </StaggerList>

        {/* Charts & Analysis Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chart - 2/3 width */}
          <Card className="lg:col-span-2 animate-fade-in-scale">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-card/50 rounded-lg flex items-center justify-center text-muted-foreground">
                <p className="text-sm">Chart placeholder - integrate Chart.js or Recharts</p>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Stats - 1/3 width */}
          <Card className="animate-fade-in-scale" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                  <span className="text-sm font-medium">Conversion Rate</span>
                  <span className="font-bold text-emerald-600">3.2%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                  <span className="text-sm font-medium">Avg. Session</span>
                  <span className="font-bold">4m 23s</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                  <span className="text-sm font-medium">Bounce Rate</span>
                  <span className="font-bold text-rose-600">32.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GradientDivider */}
        <GradientDivider variant="horizontal" gradient="indigo-cyan" />

        {/* Tabbed Analytics */}
        <div className="animate-fade-in">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="exports">Exports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Pages</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { page: "/dashboard", views: "4,243", trend: "up" },
                      { page: "/tools", views: "2,891", trend: "up" },
                      { page: "/pricing", views: "1,450", trend: "down" },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-card/50 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-sm">{item.page}</p>
                          <p className="text-xs text-muted-foreground">{item.views} views</p>
                        </div>
                        {item.trend === "up" ? (
                          <ArrowUp className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-rose-600" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Traffic Sources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { source: "Organic", percentage: 45 },
                      { source: "Direct", percentage: 30 },
                      { source: "Referral", percentage: 15 },
                      { source: "Social", percentage: 10 },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.source}</span>
                          <span className="text-muted-foreground">{item.percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-card/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Analytics</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">Detailed metrics coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exports">
              <Card>
                <CardHeader>
                  <CardTitle>Export Data</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">Export options coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}
