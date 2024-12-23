"use client";

import { NavMain } from "@/components/sidebar/nav-main";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { SquareTerminal } from "lucide-react";
import type * as React from "react";
import { UserList } from "./user-list";

// This is sample data.
const data = {
	navMain: [
		{
			title: "Playground",
			url: "#",
			icon: SquareTerminal,
			isActive: true,
			items: [
				{
					title: "History",
					url: "#",
				},
				{
					title: "Starred",
					url: "#",
				},
				{
					title: "Settings",
					url: "#",
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<p>Chat with bun</p>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<UserList items={data.navMain} />
			</SidebarContent>

			<SidebarRail />
		</Sidebar>
	);
}
