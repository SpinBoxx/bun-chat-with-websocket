"use server";

import type { Group } from "@/types/group";

interface Params {
	usersId: number[];
}

export const createGroupAction = async ({ usersId }: Params) => {
	const response = await fetch("http://localhost:3000/create-group", {
		body: JSON.stringify({
			usersId,
		}),
		method: "POST",
	});
	if (!response.ok) {
		return null;
	}
	const data: Group = await response.json();

	return data;
};
