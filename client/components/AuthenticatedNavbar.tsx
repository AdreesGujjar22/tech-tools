"use client";

import Navbar from "@/components/Navbar";

type AuthenticatedNavbarProps = {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
};

export default function AuthenticatedNavbar({ collapsed, onCollapsedChange }: AuthenticatedNavbarProps) {
  return <Navbar collapsed={collapsed} onCollapsedChange={onCollapsedChange} />;
}
