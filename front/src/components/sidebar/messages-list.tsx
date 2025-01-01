"use client";

import { getMessagesInGroupAction } from "@/actions/get-groups";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuSub,
} from "@/components/ui/sidebar";
import { useUserStore } from "@/stores/use-user-store";
import { useQuery } from "@tanstack/react-query";

export function NavMain() {
	const { user } = useUserStore();

	const groupsQuery = useQuery({
		queryKey: ["get-groups"],
		queryFn: async () => {
			if (user) {
				return await getMessagesInGroupAction({
					userId: user.id,
				});
			}
		},
		refetchOnWindowFocus: false,
	});

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Messages</SidebarGroupLabel>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuSub>
						{groupsQuery.data?.map((item) => (
							<SidebarMenuItem key={item.id}>
								<span>{item.id}</span>
							</SidebarMenuItem>
						))}
						{/* {item.items?.map((subItem) => (
								<SidebarMenuSubItem key={subItem.title}>
									<SidebarMenuSubButton asChild>
										<a href={subItem.url}>
											<span>{subItem.title}</span>
										</a>
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>
							))} */}
					</SidebarMenuSub>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}
