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
    <div className={cn("inline-flex items-center justify-center p-1 bg-secondary rounded-xl border border-border/60", className)}>
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
        "px-4 py-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground rounded-lg transition-all duration-155 cursor-pointer",
        isSelected && "bg-card text-foreground shadow-sm border border-border/30",
        className
      )}
    >
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

  return <div className={cn("mt-4 select-none focus:outline-none animate-fade-in", className)}>{children}</div>;
}
