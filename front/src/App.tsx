"use client";

import { useState } from "react";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { UserPseudoCard } from "./components/cards/user-pseudo-card";
import MainSection from "./components/main-section/main-section";
import { AppSidebar } from "./components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { useUserStore } from "./stores/use-user-store";

type Message = {
	pseudo: string;
	message: string;
};
const queryClient = new QueryClient();
function App() {
	const [count, setCount] = useState(0);
	// const socket = new WebSocket("ws://localhost:3000/chat");
	const [messages, setMessages] = useState<Message[]>([]);
	const { user } = useUserStore();
	const submitMessage = (formData: FormData) => {
		const message = formData.get("message");
		const pseudo = formData.get("pseudo");

		// if (socket.readyState === WebSocket.OPEN) {
		// 	const data = {
		// 		pseudo,
		// 		message,
		// 	};
		// 	socket.send(JSON.stringify(data));
		// }
	};

	// Listen for messages
	// socket.addEventListener("message", (event) => {
	// 	console.log(event);

	// 	setMessages(JSON.parse(event.data));
	// });

	return (
		<>
			<QueryClientProvider client={queryClient}>
				<>
					<SidebarProvider>
						<AppSidebar />
						<SidebarInset>
							<MainSection />
						</SidebarInset>
					</SidebarProvider>
					<Toaster />
					<UserPseudoCard />
				</>
			</QueryClientProvider>
		</>
	);
}

export default App;
