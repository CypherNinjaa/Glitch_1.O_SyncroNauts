import React, { useState } from "react";
import {
	Box,
	Container,
	Paper,
	Typography,
	TextField,
	IconButton,
	List,
	ListItem,
	Chip,
	Divider,
	AppBar,
	Toolbar,
	Badge,
	Button,
	Grid,
	Card,
	CardContent,
	Alert,
} from "@mui/material";
import {
	Send as SendIcon,
	Group as GroupIcon,
	ExitToApp as ExitIcon,
	KeyboardArrowDown as ScrollDownIcon,
	Person as PersonIcon,
} from "@mui/icons-material";
import { useGroupChat } from "../hooks/useGroupChat";

// Message component similar to reference repo
const GroupMessage = ({ message, isCurrentUser }) => {
	const formatTime = (timestamp) => {
		return new Date(timestamp).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<ListItem
			sx={{
				display: "flex",
				justifyContent: isCurrentUser ? "flex-end" : "flex-start",
				px: 2,
				py: 1,
			}}
		>
			<Box
				sx={{
					maxWidth: "70%",
					bgcolor: isCurrentUser ? "#1976d2" : "#f5f5f5",
					color: isCurrentUser ? "white" : "text.primary",
					borderRadius: 2,
					px: 2,
					py: 1,
					position: "relative",
					"&::before": {
						content: '""',
						position: "absolute",
						top: 0,
						[isCurrentUser ? "right" : "left"]: -8,
						width: 0,
						height: 0,
						borderTop: "8px solid transparent",
						borderBottom: "8px solid transparent",
						[isCurrentUser ? "borderLeft" : "borderRight"]: `8px solid ${
							isCurrentUser ? "#1976d2" : "#f5f5f5"
						}`,
					},
				}}
			>
				{!isCurrentUser && (
					<Typography
						variant="caption"
						sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}
					>
						{message.username}
					</Typography>
				)}
				<Typography variant="body2" sx={{ wordBreak: "break-word" }}>
					{message.message_text}
				</Typography>
				<Typography
					variant="caption"
					sx={{
						display: "block",
						mt: 0.5,
						opacity: 0.7,
						textAlign: "right",
					}}
				>
					{formatTime(message.created_at)}
				</Typography>
			</Box>
		</ListItem>
	);
};

// Message input form similar to reference repo
const MessageForm = () => {
	const [message, setMessage] = useState("");
	const [isSending, setIsSending] = useState(false);
	const { sendMessage, error, setError } = useGroupChat();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message.trim() || isSending) return;

		setIsSending(true);
		setError("");

		const success = await sendMessage(message.trim());
		if (success) {
			setMessage("");
		}
		setIsSending(false);
	};

	return (
		<Paper elevation={2} sx={{ p: 2 }}>
			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}
			<Box
				component="form"
				onSubmit={handleSubmit}
				sx={{ display: "flex", gap: 1 }}
			>
				<TextField
					fullWidth
					placeholder="Type your message..."
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					disabled={isSending}
					variant="outlined"
					size="small"
					sx={{ bgcolor: "background.paper" }}
				/>
				<IconButton
					type="submit"
					disabled={!message.trim() || isSending}
					sx={{
						bgcolor: "#1976d2",
						color: "white",
						"&:hover": { bgcolor: "#1565c0" },
						"&:disabled": { bgcolor: "grey.300" },
					}}
				>
					<SendIcon />
				</IconButton>
			</Box>
		</Paper>
	);
};

// Main GroupChat component
const GroupChat = () => {
	const {
		currentGroup,
		groupMembers,
		groupMessages,
		loadingMessages,
		error,
		scrollRef,
		onScroll,
		scrollToBottom,
		isOnBottom,
		unviewedMessageCount,
		leaveGroup,
	} = useGroupChat();

	// Get current user info
	const currentUsername = localStorage.getItem("username") || "";

	const handleLeaveGroup = async () => {
		if (window.confirm("Are you sure you want to leave this group?")) {
			await leaveGroup();
			// This will trigger a redirect back to the landing page
			window.location.href = "/group-chat";
		}
	};

	if (!currentGroup) {
		return (
			<Container maxWidth="sm" sx={{ py: 4 }}>
				<Alert severity="info">
					<Typography variant="h6">No Active Group</Typography>
					<Typography variant="body2">
						You're not currently in any group. Please create or join a group to
						start chatting.
					</Typography>
					<Button variant="contained" href="/group-chat" sx={{ mt: 2 }}>
						Back to Group Chat
					</Button>
				</Alert>
			</Container>
		);
	}

	return (
		<Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
			{/* Header Bar */}
			<AppBar position="static" sx={{ bgcolor: "#1976d2" }}>
				<Toolbar>
					<GroupIcon sx={{ mr: 2 }} />
					<Box sx={{ flexGrow: 1 }}>
						<Typography variant="h6" component="div">
							{currentGroup.group_name}
						</Typography>
						<Typography variant="caption">
							ID: {currentGroup.group_id} • {groupMembers.length} members
						</Typography>
					</Box>
					<Button
						color="inherit"
						startIcon={<ExitIcon />}
						onClick={handleLeaveGroup}
						size="small"
					>
						Leave
					</Button>
				</Toolbar>
			</AppBar>

			{/* Main Content Area */}
			<Container
				maxWidth="md"
				sx={{ flexGrow: 1, display: "flex", flexDirection: "column", py: 2 }}
			>
				<Grid container spacing={2} sx={{ flexGrow: 1 }}>
					{/* Messages Area */}
					<Grid item xs={12} md={8}>
						<Paper
							elevation={2}
							sx={{
								height: "70vh",
								display: "flex",
								flexDirection: "column",
								position: "relative",
							}}
						>
							{/* Messages List */}
							<Box
								ref={scrollRef}
								onScroll={onScroll}
								sx={{
									flexGrow: 1,
									overflow: "auto",
									bgcolor: "#fafafa",
								}}
							>
								{loadingMessages ? (
									<Box sx={{ p: 4, textAlign: "center" }}>
										<Typography variant="body2" color="text.secondary">
											Loading messages...
										</Typography>
									</Box>
								) : error ? (
									<Box sx={{ p: 4, textAlign: "center" }}>
										<Alert severity="error">{error}</Alert>
									</Box>
								) : groupMessages.length === 0 ? (
									<Box sx={{ p: 4, textAlign: "center" }}>
										<Typography variant="body2" color="text.secondary">
											No messages yet. Start the conversation! 🎉
										</Typography>
									</Box>
								) : (
									<List sx={{ py: 0 }}>
										{groupMessages
											.slice()
											.reverse()
											.map((message) => (
												<GroupMessage
													key={message.id}
													message={message}
													isCurrentUser={message.username === currentUsername}
												/>
											))}
									</List>
								)}
							</Box>

							{/* Scroll to bottom button */}
							{!isOnBottom && (
								<Box
									sx={{
										position: "absolute",
										bottom: 80,
										right: 16,
										zIndex: 1,
									}}
								>
									<IconButton
										onClick={scrollToBottom}
										sx={{
											bgcolor: "#1976d2",
											color: "white",
											"&:hover": { bgcolor: "#1565c0" },
											boxShadow: 2,
										}}
									>
										<Badge
											badgeContent={
												unviewedMessageCount > 0 ? unviewedMessageCount : null
											}
											color="error"
										>
											<ScrollDownIcon />
										</Badge>
									</IconButton>
								</Box>
							)}

							{/* Message Input */}
							<Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
								<MessageForm />
							</Box>
						</Paper>
					</Grid>

					{/* Sidebar - Group Members */}
					<Grid item xs={12} md={4}>
						<Paper elevation={2} sx={{ height: "70vh", overflow: "auto" }}>
							<Box sx={{ p: 2 }}>
								<Typography
									variant="h6"
									gutterBottom
									sx={{ display: "flex", alignItems: "center" }}
								>
									<PersonIcon sx={{ mr: 1 }} />
									Members ({groupMembers.length})
								</Typography>
								<Divider sx={{ mb: 2 }} />

								{groupMembers.map((member, index) => (
									<Box key={member.user_id || index} sx={{ mb: 1 }}>
										<Chip
											label={member.username}
											variant={
												member.username === currentUsername
													? "filled"
													: "outlined"
											}
											color={
												member.username === currentUsername
													? "primary"
													: "default"
											}
											size="small"
											sx={{ mr: 1, mb: 1 }}
										/>
									</Box>
								))}
							</Box>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default GroupChat;
