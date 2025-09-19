import { useContext } from "react";
import { GroupChatContext } from "../context/GroupChatContext";

export const useGroupChat = () => {
	const context = useContext(GroupChatContext);

	if (context === undefined) {
		throw new Error("useGroupChat must be used within a GroupChatProvider");
	}

	return context;
};
