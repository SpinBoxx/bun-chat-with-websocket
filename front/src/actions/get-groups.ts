"use server";

import type { User } from "@/types/user";

interface Params {
	userId: number;
}

export const getMessagesInGroupAction = async ({ userId }: Params) => {
	const response = await fetch(`http://localhost:3000/users/${userId}/groups`);
	if (!response.ok) {
		return null;
	}

	const data: User[] = await response.json();

	return data;
};
