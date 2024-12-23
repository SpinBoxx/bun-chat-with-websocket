import type { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
	user: User | null;
	setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>()(
	persist(
		(set, get) => ({
			user: null,
			setUser: (user: User) => {
				set({ user });
			},
		}),
		{ name: "user-store" },
	),
);
