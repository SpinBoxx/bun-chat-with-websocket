import { getMessagesInGroupAction } from "@/actions/get-messages";
import { sendMessageAction } from "@/actions/send-message";
import { queryKeys } from "@/constants/query-keys";
import { cn } from "@/lib/utils";
import { useConversationStore } from "@/stores/use-conversation";
import { useUserStore } from "@/stores/use-user-store";
import type { Message } from "@/types/message";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "../ui/input";

const Conversation = () => {
	const socket = new WebSocket("ws://localhost:3000/chat");
	const { groupId } = useConversationStore();
	const [messages, setMessages] = useState<Message[] | null>(null);
	const { user } = useUserStore();
	const messagesQuery = useQuery({
		queryKey: [queryKeys.getMessages, groupId],
		queryFn: async () => {
			if (groupId) {
				const messages = await getMessagesInGroupAction({
					groupId,
				});
				return messages;
			}
		},
	});

	const sendMessage = async (formData: FormData) => {
		const message = formData.get("message") as string;
		if (groupId && user) {
			const sendMessageRes = await sendMessageAction({
				groupId,
				from: user.id,
				message,
			}).then((data) => socket.send(""));
		}
	};

	socket.addEventListener("message", (event) => {
		console.log(event.data);

		setMessages(JSON.parse(event.data));
	});

	const isItsMe = (message: Message) => {
		return message.user?.name === user?.name;
	};

	return (
		<div>
			{messagesQuery.data?.length}
			{messages?.length}
			<div className="w-full h-96">
				{(messages ?? messagesQuery.data)?.map((message) => (
					<div
						key={message.id}
						className={cn("w-fit", isItsMe(message) && "ml-auto")}
					>
						<p>{message.message}</p>
					</div>
				))}
			</div>

			<form action={sendMessage}>
				<Input name="message" placeholder="Type a message...." />
			</form>
		</div>
	);
};

export default Conversation;
