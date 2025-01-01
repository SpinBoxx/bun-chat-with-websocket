"use server";

import type { User } from "@/types/user";

interface Params {
	username: string;
}

export const saveUserAction = async ({ username }: Params) => {
	const response = await fetch("http://localhost:3000/save-user", {
		body: JSON.stringify({
			username,
		}),
		method: "POST",
	});
	if (!response.ok) {
		const error = await response.json();

		return {
			ok: false,
			errorMessage: error.errorMessage as string,
		};
	}
	const data: User = await response.json();

	return {
		ok: true,
		data,
	};
};
