import React, { useState, useEffect } from "react";
import { GroupChatProvider } from "../context/GroupChatContext";
import { useGroupChat } from "../hooks/useGroupChat";
import GroupChatLanding from "../components/GroupChatLanding";
import GroupChat from "../components/GroupChat";

// Inner component that uses the GroupChat context
const GroupChatPageContent = () => {
	const { currentGroup } = useGroupChat();
	const [showChat, setShowChat] = useState(false);

	// Check if user is already in a group on page load
	useEffect(() => {
		if (currentGroup) {
			setShowChat(true);
		}
	}, [currentGroup]);

	// eslint-disable-next-line no-unused-vars
	const handleGroupReady = (groupId) => {
		// Transition to chat interface
		setShowChat(true);
	};

	// Show the appropriate component based on state
	if (showChat && currentGroup) {
		return <GroupChat />;
	}

	return <GroupChatLanding onGroupReady={handleGroupReady} />;
};

// Main page component that provides the context
const GroupChatPage = () => {
	return (
		<GroupChatProvider>
			<GroupChatPageContent />
		</GroupChatProvider>
	);
};

export default GroupChatPage;
