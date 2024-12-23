import { useConversationStore } from "@/stores/use-conversation";
import { adventurer } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMemo } from "react";

const Header = () => {
	const { to } = useConversationStore();

	const avatar = useMemo(
		() =>
			createAvatar(adventurer, {
				seed: "Jude",
				scale: 130,
				radius: 50,
				backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"],
			}),
		[],
	);

	const svg = avatar.toDataUri();

	return (
		<div className=" border-b pb-3 w-full border-slate-800/80 flex gap-3">
			<div className=" rounded-full relative size-12">
				<img alt="avatr" src={svg} />
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-xl font-bold">{to?.name ?? "Quentin"}</span>
				<span className="text-muted-foreground text-sm">Active 1min ago</span>
			</div>
		</div>
	);
};

export default Header;
