"use server";

import type { User } from "@/types/user";

interface Params {
	groupId: number;
	message: string;
	from: number;
}

export const sendMessageAction = async ({ groupId, message, from }: Params) => {
	const response = await fetch("http://localhost:3000/send-message", {
		body: JSON.stringify({
			groupId,
			message,
			from,
		}),
		method: "POST",
	});
	if (!response.ok) {
		return null;
	}
	const data: User = await response.json();

	return data;
};
