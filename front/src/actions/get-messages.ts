"use server";

import type { Message } from "@/types/message";

interface Params {
	groupId: number;
}

export const getMessagesInGroupAction = async ({ groupId }: Params) => {
	const response = await fetch(
		`http://localhost:3000/group/${groupId}/messages`,
	);
	if (!response.ok) {
		return null;
	}
	const data: Message[] = await response.json();

	return data;
};
