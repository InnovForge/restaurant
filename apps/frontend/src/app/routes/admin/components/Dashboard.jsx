import { Link } from "react-router";
import { Home, Utensils, ShoppingBag, User, Table, BarChart3, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import { useParams } from "react-router";
import useAuthUserStore from "@/stores/useAuthUserStore";
import { generateAvatarInitial } from "@/utils/generateAvatarInitial";

export default function DashboardLayout({ children }) {
  const { restaurantId } = useParams();
  const { authUser } = useAuthUserStore();

  console.log("DashboardLayout", authUser);

  const menuItems = [
    { path: "", icon: User, label: "Thông tin" },
    { path: "thongke", icon: BarChart3, label: "Thống kê" },
    { path: "menu", icon: Utensils, label: "Menu" },
    { path: "hoadon", icon: ShoppingBag, label: "Hóa đơn" },
    { path: "datban", icon: Table, label: "Đặt Bàn Ăn" },
    { path: "ban", icon: Table, label: "Bàn Ăn" },
  ];

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link to="/d/restaurants">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Utensils className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-semibold">Quản Lý Nhà Hàng</span>
                      <span className="text-xs text-muted-foreground">Admin Dashboard</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <div className="flex flex-col items-center py-4 space-y-2">
                <Avatar className="h-16 w-16 border-2 border-muted">
                  <AvatarImage src={authUser?.avatarUrl || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {generateAvatarInitial(authUser?.name || "NB")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-lg font-semibold">{authUser?.name || "Nhat blue"}</h2>
                  <p className="text-sm text-muted-foreground">{authUser?.email || "Chưa có email"}</p>
                </div>
              </div>

              <Separator className="my-2" />

              <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map(({ path, icon: Icon, label }) => (
                    <SidebarMenuItem key={path + label}>
                      <SidebarMenuButton asChild>
                        <Link to={path}>
                          <Icon className="size-4" />
                          <span>{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild variant="ghost">
                  <Link to="/home" className="text-muted-foreground hover:text-foreground">
                    <Home className="size-4" />
                    <span>Trang chủ</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild variant="ghost" className="text-destructive hover:text-destructive">
                  <button onClick={() => console.log("Logout clicked")}>
                    <LogOut className="size-4" />
                    <span>Đăng xuất</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>
          <main className="flex-1 overflow-y-auto p-5">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
