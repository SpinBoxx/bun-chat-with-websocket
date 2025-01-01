"use client";

import { ChevronRight, type LucideIcon, Users2 } from "lucide-react";

import { createGroupAction } from "@/actions/create-group";
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
import { useConversationStore } from "@/stores/use-conversation";
import { useUserStore } from "@/stores/use-user-store";
import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function UserList() {
	const [users, setUsers] = useState<User[] | null>(null);
	const { setGroupId, setTo } = useConversationStore();
	const { user } = useUserStore();
	const socket = new WebSocket("ws://localhost:3000/users");

	if (!user) {
		return null;
	}

	const usersQuery = useQuery({
		queryKey: ["get-users"],
		queryFn: async () => {
			return await getUsersAction();
		},
		refetchOnWindowFocus: false,
	});

	// Listen for messages
	socket.addEventListener("message", (event) => {
		console.log(event);

		setUsers(JSON.parse(event.data));
	});

	const createConversation = useCallback(
		async (userId: number) => {
			const group = await createGroupAction({ usersId: [userId, user.id] });
			if (group) {
				setGroupId(group.id);
				setTo(group.users.filter((_user) => _user.id !== user.id));
			}
		},
		[setGroupId, setTo, user.id],
	);

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Users</SidebarGroupLabel>
			<SidebarMenu>
				<Collapsible asChild className="group/collapsible ">
					<SidebarMenuItem>
						{(users ?? usersQuery.data)?.map((user) => (
							<SidebarMenuButton
								key={user.id}
								onClick={() => createConversation(user.id)}
							>
								<span>{user.name}</span>
								<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
							</SidebarMenuButton>
						))}
					</SidebarMenuItem>
				</Collapsible>
			</SidebarMenu>
		</SidebarGroup>
	);
}
