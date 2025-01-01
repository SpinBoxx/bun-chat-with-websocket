"use client";

import { NavMain } from "@/components/sidebar/messages-list";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import type * as React from "react";
import { UserList } from "./user-list";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<p>Chat with bun</p>
			</SidebarHeader>
			<SidebarContent>
				<NavMain />
				<UserList />
			</SidebarContent>

			<SidebarRail />
		</Sidebar>
	);
}
