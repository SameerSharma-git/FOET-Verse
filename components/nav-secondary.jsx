import * as React from "react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  setFirstSelect,
  setSecondSelect,
  items,
  ...props
}) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
              <SidebarMenuItem onClick={() => {setSecondSelect(item.title); setFirstSelect("General")}} key={item.title}>
                <SidebarMenuButton className={'cursor-pointer'} asChild size="sm">
                  <div>
                    <item.icon />
                    <span>{item.title}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
