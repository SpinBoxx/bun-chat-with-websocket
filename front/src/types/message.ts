import type { User } from "./user";

export type Message = {
	id: number;
	message: string;

	user: User;
};
