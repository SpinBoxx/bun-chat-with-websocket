import { saveUserAction } from "@/actions/save-user";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/stores/use-user-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function UserPseudoCard() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const socket = new WebSocket("ws://localhost:3000/users");
	const { user, setUser } = useUserStore();
	const toggleModalOpen = () => {
		if (user) {
			setIsModalOpen(!isModalOpen);
		}
	};

	useEffect(() => {
		if (localStorage && !user) {
			setIsModalOpen(true);
		}
	});

	const saveUserInfo = async (formData: FormData) => {
		const username = formData.get("username") as string;

		if (username) {
			const saveUserResponse = await saveUserAction({
				username,
			}).then((response) => {
				if (response.ok && response.data) {
					setUser(response.data);
					toast.success(response.data.name);
					socket.send(JSON.stringify("User created !"));
					setIsModalOpen(false);
				} else {
					toast.error(response.errorMessage);
				}
			});
		}
	};
	return (
		<Dialog open={isModalOpen} onOpenChange={toggleModalOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Enter your pseudo</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<form action={saveUserInfo}>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="username" className="text-right">
								Username
							</Label>
							<Input
								name="username"
								id="username"
								placeholder="@peduarte"
								className="col-span-3"
							/>
						</div>
						<Button type="submit" className="w-fit ml-auto mt-4">
							Save pseudo
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
