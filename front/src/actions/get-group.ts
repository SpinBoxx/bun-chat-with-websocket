"use server";

import type { Group } from "@/types/group";

interface Params {
	groupId: number;
}

export const getGroup = async ({ groupId }: Params) => {
	const response = await fetch(`http://localhost:3000/groups/${groupId}`);
	if (!response.ok) {
		return null;
	}

	const data: Group = await response.json();

	return data;
};
