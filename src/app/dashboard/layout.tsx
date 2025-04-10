"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";
import { Button } from "@/src/components/ui/button";
import {
  LogOut,
  LayoutDashboard,
  ImageIcon,
  Briefcase,
  Settings,
  User,
} from "lucide-react";
import { getMe, type AdminData } from "@/src/lib/api/auth";
import { Toaster } from "@/src/components/ui/toaster";
import { useToast } from "@/src/hooks/use-toast";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AdminData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const verifyAuth = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
        setLoading(false);
      } catch (error: any) {
        // Only redirect if it's specifically a 401 error
        if (error.response && error.response.status === 401) {
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Your session has expired. Please login again.",
          });
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          // For other errors, just show a toast but don't redirect
          toast({
            variant: "destructive",
            title: "Server Error",
            description:
              "There was a problem connecting to the server. Please try again later.",
          });
          setLoading(false);
        }
      }
    };

    verifyAuth();
  }, [router, toast]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <Image
              src="https://admin.artjalyuzi.uz/logo.png"
              alt="Next Image"
              className="object-cover rounded"
              width={200}
              height={100}
            />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                  <a href="/dashboard">
                    <LayoutDashboard className="mr-2" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.includes("/dashboard/banners")}
                >
                  <a href="/dashboard/banners">
                    <ImageIcon className="mr-2" />
                    <span>Banners</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.includes("/dashboard/portfolios")}
                >
                  <a href="/dashboard/portfolios">
                    <Briefcase className="mr-2" />
                    <span>Portfolios</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.includes("/dashboard/services")}
                >
                  <a href="/dashboard/services">
                    <Settings className="mr-2" />
                    <span>Services</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="mb-4 flex items-center gap-3 px-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <a className="flex flex-col" href="/dashboard/admin">
                <span className="text-sm font-medium">
                  {user?.login || "Admin"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Administrator
                </span>
              </a>
            </div>
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarTrigger />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {pathname === "/dashboard" && "Dashboard"}
              {pathname.includes("/dashboard/banners") && "Banners Management"}
              {pathname.includes("/dashboard/portfolios") &&
                "Portfolios Management"}
              {pathname.includes("/dashboard/services") &&
                "Services Management"}
            </h1>
          </div>
          {children}
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
