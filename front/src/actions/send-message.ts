"use server";

import type { User } from "@/types/user";

interface Params {
	groupId: number;
	message: string;
}

export const sendMessageAction = async ({ groupId, message }: Params) => {
	const response = await fetch("http://localhost:3000/send-message", {
		body: JSON.stringify({
			groupId,
			message,
		}),
		method: "POST",
	});
	if (!response.ok) {
		return null;
	}
	const data: User = await response.json();

	return data;
};
