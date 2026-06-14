import React, { useState } from "react";
import { ChevronLeft, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: number | string;
}

export interface SidebarProps {
  items: SidebarItem[];
  onItemClick?: (item: SidebarItem) => void;
  className?: string;
  mobileOpen?: boolean;
  onMobileToggle?: (open: boolean) => void;
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ items, onItemClick, className, mobileOpen = false, onMobileToggle }, ref) => {
    const [collapsed, setCollapsed] = useState(false);

    const handleItemClick = (item: SidebarItem) => {
      if (onItemClick) onItemClick(item);
      if (item.onClick) item.onClick();
    };

    return (
      <>
        {/* Mobile menu button */}
        <button
          onClick={() => onMobileToggle?.(!mobileOpen)}
          className="fixed bottom-6 right-6 md:hidden z-40 w-14 h-14 rounded-full glass-card border border-border/60 flex items-center justify-center text-foreground hover:border-primary/40 hover:shadow-lg transition-all duration-300 animate-fade-in"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar */}
        <aside
          ref={ref}
          className={cn(
            "fixed left-0 top-0 h-screen transition-all duration-300 ease-in-out z-30",
            "glass-card border-r border-border/60 backdrop-blur-xl",
            "flex flex-col py-6 gap-4",
            collapsed ? "w-20" : "w-64",
            "hidden md:flex",
            className
          )}
        >
          {/* Header with collapse button */}
          <div className="px-4 flex items-center justify-between">
            {!collapsed && <span className="font-bold text-lg gradient-text">Tools</span>}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg hover:bg-accent/50 transition-colors duration-200 ml-auto"
              aria-label="Toggle sidebar"
            >
              <ChevronLeft
                size={20}
                className={cn("transition-transform duration-300", collapsed && "rotate-180")}
              />
            </button>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 overflow-y-auto space-y-2 px-3">
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleItemClick(item)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  "hover:bg-accent/50 text-foreground/80 hover:text-foreground",
                  "hover:shadow-md hover:-translate-y-0.5 group relative",
                  "focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                <span className="flex-shrink-0 text-lg">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            ))}
          </nav>

          {/* Footer slot */}
          <div className={cn("border-t border-border/40 pt-4 px-3", collapsed && "text-center")}>
            {!collapsed && <p className="text-xs text-muted-foreground">© 2024 Tech Tools</p>}
          </div>
        </aside>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20 md:hidden animate-fade-in"
            onClick={() => onMobileToggle?.(false)}
          />
        )}

        {/* Mobile sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 h-screen w-64 transition-all duration-300 ease-in-out z-20",
            "glass-card border-r border-border/60 backdrop-blur-xl",
            "flex flex-col py-6 gap-4",
            "md:hidden",
            !mobileOpen && "-translate-x-full"
          )}
        >
          <div className="px-6 flex items-center justify-between">
            <span className="font-bold text-lg gradient-text">Tools</span>
            <button
              onClick={() => onMobileToggle?.(false)}
              className="p-1.5 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto space-y-2 px-4">
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  handleItemClick(item);
                  onMobileToggle?.(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
                  "hover:bg-accent/50 text-foreground/80 hover:text-foreground",
                  "hover:shadow-md"
                )}
              >
                <span className="flex-shrink-0 text-lg">{item.icon}</span>
                <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>
      </>
    );
  }
);

Sidebar.displayName = "Sidebar";
export default Sidebar;
