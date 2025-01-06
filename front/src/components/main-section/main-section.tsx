import { getGroup } from "@/actions/get-group";
import { useConversationStore } from "@/stores/use-conversation";
import Conversation from "./conversation";
import Header from "./header";

const MainSection = () => {
	const { groupId } = useConversationStore();

	const isConversationExist = async () => {
		if (groupId) {
			const group = await getGroup({ groupId });
			if (!group) {
				return false;
			}
			return true;
		}
		return false;
	};

	return (
		<div className=" p-4">
			<Header />
			<Conversation />
		</div>
	);
};

export default MainSection;
