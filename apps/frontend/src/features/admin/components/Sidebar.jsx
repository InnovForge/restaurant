import { BadgeAlert , Home, ChartColumnDecreasing , Croissant , Settings, CircleUserRound} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "Customers",
        url: "#",
        icon: CircleUserRound ,
    },
    {
        title: "Analytics",
        url: "#",
        icon: ChartColumnDecreasing,
    },
    {
        title: "Foods",
        url: "#",
        icon: Croissant ,
    },
    {
        title: "Reports",
        url: "#",
        icon: BadgeAlert  ,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
]

const SidebarRight = () => {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xl">Admin

                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default SidebarRight