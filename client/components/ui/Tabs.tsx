import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface TabsContextProps {
  activeTab: string;
  setActiveTab: (val: string) => void;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

export function Tabs({
  defaultValue,
  className,
  children,
  onValueChange
}: {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
}) {
  const [activeTab, setActiveTabState] = useState(defaultValue);

  const setActiveTab = (val: string) => {
    setActiveTabState(val);
    if (onValueChange) {
      onValueChange(val);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn(
      "inline-flex items-center justify-center gap-1 p-1.5",
      "glass-card rounded-2xl border border-border/40 backdrop-blur-sm",
      "shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  className,
  children
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used inside Tabs");

  const isSelected = context.activeTab === value;

  return (
    <button
      onClick={() => context.setActiveTab(value)}
      className={cn(
        "px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer relative",
        "text-muted-foreground hover:text-foreground hover:bg-accent/50",
        isSelected && "text-foreground bg-card/80 shadow-sm border border-border/40 hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      {isSelected && (
        <span className="absolute -bottom-1.5 left-2 right-2 h-0.5 rounded-full brand-gradient" />
      )}
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used inside Tabs");

  if (context.activeTab !== value) return null;

  return <div className={cn("mt-6 select-none focus:outline-none animate-fade-in-scale", className)}>{children}</div>;
}
