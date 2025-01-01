import type { Message } from "./message";
import type { User } from "./user";

export type Group = {
	id: number;
	users: User[];
	messages: Message[];
};
