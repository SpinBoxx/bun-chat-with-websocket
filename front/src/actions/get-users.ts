"use server";

import type { User } from "@/types/user";

export const getUsersAction = async () => {
	const response = await fetch("http://localhost:3000/userss");
	if (!response.ok) {
		return null;
	}
	const data: User[] = await response.json();

	return data;
};
