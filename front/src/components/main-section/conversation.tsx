import { getMessagesInGroupAction } from "@/actions/get-messages";
import { sendMessageAction } from "@/actions/send-message";
import type { Message } from "@/types/message";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "../ui/input";

const Conversation = () => {
	const socket = new WebSocket("ws://localhost:3000/chat");

	const [messages, setMessages] = useState<Message[] | null>(null);
	const messagesQuery = useQuery({
		queryKey: ["get-messages"],
		queryFn: async () => {
			const messages = await getMessagesInGroupAction({
				groupId: 2,
			});
			return messages;
		},
	});

	const sendMessage = async (formData: FormData) => {
		const message = formData.get("message") as string;
		const sendMessageRes = await sendMessageAction({
			groupId: 2,
			message,
		}).then((data) => socket.send(""));
	};

	socket.addEventListener("message", (event) => {
		console.log(event.data);

		setMessages(JSON.parse(event.data));
	});

	return (
		<div>
			{messagesQuery.data?.length}
			{messages?.length}
			{(messages ?? messagesQuery.data)?.map((message) => (
				<p key={message.id}>{message.message}</p>
			))}

			<form action={sendMessage}>
				<Input name="message" placeholder="Type a message...." />
			</form>
		</div>
	);
};

export default Conversation;
