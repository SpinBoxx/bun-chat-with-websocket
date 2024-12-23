"use client";

import { ChevronRight, type LucideIcon, Users2 } from "lucide-react";

import { getUsersAction } from "@/actions/get-users";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function UserList({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	const [users, setUsers] = useState<User[] | null>(null);

	const socket = new WebSocket("ws://localhost:3000/users");

	const usersQuery = useQuery({
		queryKey: ["get-users"],
		queryFn: async () => {
			return await getUsersAction();
		},
		refetchOnWindowFocus: false,
	});
	// // Listen for messages
	// socket.addEventListener("open", (event) => {

	// 	setUsers(JSON.parse(event.data));
	// });

	// Listen for messages
	socket.addEventListener("message", (event) => {
		console.log(event);

		setUsers(JSON.parse(event.data));
	});

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Users</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						key={item.title}
						asChild
						defaultOpen={item.isActive}
						className="group/collapsible "
					>
						<SidebarMenuItem>
							{(users ?? usersQuery.data)?.map((user) => (
								<SidebarMenuButton key={user.id} tooltip={item.title}>
									<span>{user.name}</span>
									<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuButton>
							))}
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
