import type { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConversationStore {
	from: User | null;
	to: User | null;
	setFrom: (user: User) => void;
	setTo: (user: User) => void;
}

export const useConversationStore = create<ConversationStore>()(
	persist(
		(set, get) => ({
			from: null,
			to: null,
			setFrom: (from: User) => {
				set({ from });
			},
			setTo: (to: User) => {
				set({ to });
			},
		}),
		{ name: "user-store" },
	),
);
