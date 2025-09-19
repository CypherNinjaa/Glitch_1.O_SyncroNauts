import { createContext, useEffect, useRef, useState } from "react";
import bcrypt from "bcryptjs";

// Import Supabase client from existing setup
import supabase from "../lib/supabase";

const GroupChatContext = createContext({});

const GroupChatProvider = ({ children }) => {
	let myChannel = null;

	// Group state
	const [currentGroup, setCurrentGroup] = useState(null);
	const [groupMembers, setGroupMembers] = useState([]);
	const [isGroupOwner, setIsGroupOwner] = useState(false);

	// Messages state (similar to reference repo)
	const [groupMessages, setGroupMessages] = useState([]);
	const [loadingMessages, setLoadingMessages] = useState(false);
	const [error, setError] = useState("");

	// UI state (similar to reference repo)
	const [isOnBottom, setIsOnBottom] = useState(false);
	const [newIncomingMessageTrigger, setNewIncomingMessageTrigger] =
		useState(null);
	const [unviewedMessageCount, setUnviewedMessageCount] = useState(0);
	const [isInitialLoad, setIsInitialLoad] = useState(false);

	// Scroll management (same pattern as reference repo)
	const scrollRef = useRef();

	// Auto-scroll on new messages (same pattern as reference repo)
	useEffect(() => {
		if (isInitialLoad) {
			setIsInitialLoad(false);
			scrollToBottom();
		}
	}, [groupMessages, isInitialLoad]);

	// Handle new incoming messages (same pattern as reference repo)
	useEffect(() => {
		if (!newIncomingMessageTrigger) return;

		// Get current user info from auth context or localStorage
		const currentUsername = localStorage.getItem("username") || "";

		if (newIncomingMessageTrigger.username === currentUsername) {
			scrollToBottom();
		} else {
			setUnviewedMessageCount((prevCount) => prevCount + 1);
		}
	}, [newIncomingMessageTrigger]);

	// Create a new group
	const createGroup = async (groupName, password) => {
		try {
			setError("");

			// Get current user
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				setError("You must be logged in to create a group");
				return null;
			}

			// Hash password for security
			const passwordHash = await bcrypt.hash(password, 10);

			// Generate unique group ID using our SQL function
			const { data: groupIdData, error: genError } = await supabase.rpc(
				"generate_group_id"
			);

			if (genError) throw genError;

			const groupId = groupIdData;

			// Create group in database
			const { data: groupData, error: groupError } = await supabase
				.from("groups")
				.insert([
					{
						group_id: groupId,
						group_name: groupName,
						password_hash: passwordHash,
						created_by: user.id,
					},
				])
				.select()
				.single();

			if (groupError) throw groupError;

			// Add creator as first member
			const username =
				localStorage.getItem("username") || user.email?.split("@")[0] || "User";

			const { error: memberError } = await supabase
				.from("group_members")
				.insert([
					{
						group_id: groupId,
						user_id: user.id,
						username: username,
					},
				]);

			if (memberError) throw memberError;

			// Set current group state
			setCurrentGroup(groupData);
			setIsGroupOwner(true);
			setGroupMembers([{ user_id: user.id, username, joined_at: new Date() }]);

			return groupId;
		} catch (error) {
			console.error("Error creating group:", error);
			setError(error.message);
			return null;
		}
	};

	// Join an existing group
	const joinGroup = async (groupId, password) => {
		try {
			setError("");

			// Get current user
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				setError("You must be logged in to join a group");
				return false;
			}

			// Get group data
			const { data: groupData, error: groupError } = await supabase
				.from("groups")
				.select("*")
				.eq("group_id", groupId)
				.eq("is_active", true)
				.single();

			if (groupError || !groupData) {
				setError("Group not found or inactive");
				return false;
			}

			// Verify password
			const passwordMatch = await bcrypt.compare(
				password,
				groupData.password_hash
			);
			if (!passwordMatch) {
				setError("Incorrect password");
				return false;
			}

			// Check if already a member
			const { data: existingMember } = await supabase
				.from("group_members")
				.select("*")
				.eq("group_id", groupId)
				.eq("user_id", user.id)
				.eq("is_active", true)
				.single();

			const username =
				localStorage.getItem("username") || user.email?.split("@")[0] || "User";

			if (!existingMember) {
				// Add as new member
				const { error: memberError } = await supabase
					.from("group_members")
					.insert([
						{
							group_id: groupId,
							user_id: user.id,
							username: username,
						},
					]);

				if (memberError) throw memberError;
			} else {
				// Reactivate membership if needed
				const { error: updateError } = await supabase
					.from("group_members")
					.update({ is_active: true })
					.eq("id", existingMember.id);

				if (updateError) throw updateError;
			}

			// Load group members
			await loadGroupMembers(groupId);

			// Set current group state
			setCurrentGroup(groupData);
			setIsGroupOwner(groupData.created_by === user.id);

			return true;
		} catch (error) {
			console.error("Error joining group:", error);
			setError(error.message);
			return false;
		}
	};

	// Load group members
	const loadGroupMembers = async (groupId) => {
		try {
			const { data, error } = await supabase
				.from("group_members")
				.select("*")
				.eq("group_id", groupId)
				.eq("is_active", true)
				.order("joined_at", { ascending: true });

			if (error) throw error;
			setGroupMembers(data || []);
		} catch (error) {
			console.error("Error loading group members:", error);
		}
	};

	// Handle new message from real-time subscription (same pattern as reference repo)
	const handleNewMessage = (payload) => {
		setGroupMessages((prevMessages) => [payload.new, ...prevMessages]);
		setNewIncomingMessageTrigger(payload.new);
	};

	// Load initial messages (same pattern as reference repo)
	const getInitialMessages = async (groupId) => {
		if (!groupId) return;

		setLoadingMessages(true);
		try {
			const { data, error } = await supabase
				.from("group_messages")
				.select()
				.eq("group_id", groupId)
				.range(0, 49)
				.order("id", { ascending: false });

			if (error) throw error;

			setIsInitialLoad(true);
			setGroupMessages(data || []);
		} catch (error) {
			console.error("Error loading messages:", error);
			setError(error.message);
		} finally {
			setLoadingMessages(false);
		}
	};

	// Subscribe to real-time messages (same pattern as reference repo)
	const subscribeToGroupMessages = (groupId) => {
		if (!groupId || myChannel) return;

		myChannel = supabase
			.channel(`group-${groupId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "group_messages",
					filter: `group_id=eq.${groupId}`,
				},
				(payload) => {
					handleNewMessage(payload);
				}
			)
			.subscribe();
	};

	// Send a message
	const sendMessage = async (messageText) => {
		if (!currentGroup || !messageText.trim()) return false;

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				setError("You must be logged in to send messages");
				return false;
			}

			const username =
				localStorage.getItem("username") || user.email?.split("@")[0] || "User";

			const { error } = await supabase.from("group_messages").insert([
				{
					group_id: currentGroup.group_id,
					user_id: user.id,
					username: username,
					message_text: messageText,
				},
			]);

			if (error) throw error;
			return true;
		} catch (error) {
			console.error("Error sending message:", error);
			setError(error.message);
			return false;
		}
	};

	// Leave group
	const leaveGroup = async () => {
		if (!currentGroup) return;

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) return;

			// Deactivate membership
			const { error } = await supabase
				.from("group_members")
				.update({ is_active: false })
				.eq("group_id", currentGroup.group_id)
				.eq("user_id", user.id);

			if (error) throw error;

			// Clean up state
			if (myChannel) {
				supabase.removeChannel(myChannel);
				myChannel = null;
			}

			setCurrentGroup(null);
			setGroupMembers([]);
			setGroupMessages([]);
			setIsGroupOwner(false);
			setError("");
		} catch (error) {
			console.error("Error leaving group:", error);
			setError(error.message);
		}
	};

	// Join group and start messaging (main entry point)
	const enterGroup = async (groupId, password) => {
		const success = await joinGroup(groupId, password);
		if (success) {
			await getInitialMessages(groupId);
			subscribeToGroupMessages(groupId);
		}
		return success;
	};

	// Scroll management (same as reference repo)
	const onScroll = async ({ target }) => {
		if (target.scrollHeight - target.scrollTop <= target.clientHeight + 1) {
			setUnviewedMessageCount(0);
			setIsOnBottom(true);
		} else {
			setIsOnBottom(false);
		}

		// Load more messages when reaching top
		if (target.scrollTop === 0 && groupMessages.length > 0) {
			const { data, error } = await supabase
				.from("group_messages")
				.select()
				.eq("group_id", currentGroup?.group_id)
				.range(groupMessages.length, groupMessages.length + 49)
				.order("id", { ascending: false });

			if (error) {
				setError(error.message);
				return;
			}
			target.scrollTop = 1;
			setGroupMessages((prevMessages) => [...prevMessages, ...data]);
		}
	};

	const scrollToBottom = () => {
		if (!scrollRef.current) return;
		scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (myChannel) {
				supabase.removeChannel(myChannel);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<GroupChatContext.Provider
			value={{
				// Group state
				currentGroup,
				groupMembers,
				isGroupOwner,

				// Messages state
				groupMessages,
				loadingMessages,
				error,
				setError,

				// UI state
				scrollRef,
				onScroll,
				scrollToBottom,
				isOnBottom,
				unviewedMessageCount,

				// Actions
				createGroup,
				joinGroup,
				enterGroup,
				leaveGroup,
				sendMessage,
				loadGroupMembers,
			}}
		>
			{children}
		</GroupChatContext.Provider>
	);
};

export { GroupChatContext, GroupChatProvider };
