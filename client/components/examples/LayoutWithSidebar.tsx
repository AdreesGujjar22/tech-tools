import React, { useState } from "react";
import { Sidebar, SidebarItem } from "@/components/ui/Sidebar";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { PageTransition } from "@/components/PageTransition";
import {
  Home,
  FileText,
  Settings,
  BarChart3,
  Users,
  HelpCircle,
  Sparkles,
  LogOut,
} from "lucide-react";

interface LayoutWithSidebarProps {
  children: React.ReactNode;
}

// Example: Complete layout with sidebar navigation
export default function LayoutWithSidebar({ children }: LayoutWithSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sidebar items configuration
  const sidebarItems: SidebarItem[] = [
    {
      label: "Dashboard",
      icon: <Home size={20} />,
      href: "/dashboard",
    },
    {
      label: "Documents",
      icon: <FileText size={20} />,
      href: "/documents",
      badge: 5,
    },
    {
      label: "Analytics",
      icon: <BarChart3 size={20} />,
      href: "/analytics",
    },
    {
      label: "Team",
      icon: <Users size={20} />,
      href: "/team",
      badge: 2,
    },
    {
      label: "Help",
      icon: <HelpCircle size={20} />,
      href: "/help",
    },
    {
      label: "Settings",
      icon: <Settings size={20} />,
      href: "/settings",
    },
    {
      label: "Logout",
      icon: <LogOut size={20} />,
      onClick: () => {
        // Handle logout
        console.log("Logout clicked");
      },
    },
  ];

  const handleSidebarItemClick = (item: SidebarItem) => {
    console.log("Sidebar item clicked:", item.label);
    // Navigate to the href or trigger onClick
    if (item.href) {
      // Use your router here
      // navigate(item.href);
    }
    if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <Sidebar
        items={sidebarItems}
        onItemClick={handleSidebarItemClick}
        mobileOpen={mobileOpen}
        onMobileToggle={setMobileOpen}
      />

      {/* Main content area - adjusted for sidebar on desktop */}
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Top navbar spacing */}
        <div className="h-16 md:h-0" />

        {/* Page content */}
        <PageTransition animation="fade-in-scale" duration="normal">
          <div className="min-h-screen pt-8 md:pt-12 pb-24 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </PageTransition>
      </div>

      {/* Floating Action Button - Ask AI */}
      <FloatingActionButton
        icon={<Sparkles />}
        label="Ask AI"
        variant="primary"
        position="bottom-right"
        onClick={() => {
          console.log("Ask AI button clicked");
          // Open AI chat modal or navigate to AI page
        }}
      />
    </div>
  );
}

// Example usage in a page:
/*
import LayoutWithSidebar from "@/components/examples/LayoutWithSidebar";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function Page() {
  return (
    <LayoutWithSidebar>
      <AdminDashboard 
        articles={[]}
        categories={[]}
        tags={[]}
        onCreatePost={() => {}}
        onEditPost={() => {}}
      />
    </LayoutWithSidebar>
  );
}
*/
