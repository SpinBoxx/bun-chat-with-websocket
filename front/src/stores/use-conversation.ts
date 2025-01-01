import type { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConversationStore {
	groupId: number | null;
	setGroupId: (groupId: number) => void;
	from: User | null;
	to: User[] | null | undefined;
	setFrom: (user: User) => void;
	setTo: (users: User[]) => void;
}

export const useConversationStore = create<ConversationStore>()(
	persist(
		(set, get) => ({
			groupId: null,
			setGroupId(groupId) {
				set({ groupId });
			},
			from: null,
			to: null,
			setFrom: (from: User) => {
				set({ from });
			},
			setTo: (to: User[]) => {
				set({ to });
			},
		}),
		{ name: "user-store" },
	),
);
