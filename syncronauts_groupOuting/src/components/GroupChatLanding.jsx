import React, { useState } from "react";
import {
	Box,
	Container,
	Typography,
	Grid,
	Card,
	CardContent,
	CardActionArea,
	Tabs,
	Tab,
	Paper,
} from "@mui/material";
import {
	GroupAdd as GroupAddIcon,
	Login as LoginIcon,
	Chat as ChatIcon,
} from "@mui/icons-material";
import GroupCreate from "./GroupCreate";
import GroupJoin from "./GroupJoin";

function TabPanel({ children, value, index, ...other }) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
		</div>
	);
}

const GroupChatLanding = ({ onGroupReady }) => {
	const [selectedTab, setSelectedTab] = useState(0);

	const handleTabChange = (event, newValue) => {
		setSelectedTab(newValue);
	};

	const handleGroupCreated = (groupId) => {
		if (onGroupReady) {
			onGroupReady(groupId);
		}
	};

	const handleGroupJoined = (groupId) => {
		if (onGroupReady) {
			onGroupReady(groupId);
		}
	};

	return (
		<Container maxWidth="md" sx={{ py: 4 }}>
			{/* Header */}
			<Box sx={{ textAlign: "center", mb: 6 }}>
				<ChatIcon sx={{ fontSize: 64, color: "#1976d2", mb: 2 }} />
				<Typography
					variant="h3"
					gutterBottom
					sx={{
						fontWeight: "bold",
						background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						backgroundClip: "text",
					}}
				>
					Group Chat
				</Typography>
				<Typography
					variant="h6"
					color="text.secondary"
					sx={{ maxWidth: 600, mx: "auto" }}
				>
					Connect with your adventure group in real-time! Create a new group or
					join an existing one to start planning your next epic journey
					together.
				</Typography>
			</Box>

			{/* Tab Selection */}
			<Paper elevation={2} sx={{ mb: 4 }}>
				<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
					<Tabs
						value={selectedTab}
						onChange={handleTabChange}
						centered
						textColor="primary"
						indicatorColor="primary"
					>
						<Tab
							icon={<GroupAddIcon />}
							label="Create Group"
							sx={{ minHeight: 80, fontSize: "1.1rem" }}
						/>
						<Tab
							icon={<LoginIcon />}
							label="Join Group"
							sx={{ minHeight: 80, fontSize: "1.1rem" }}
						/>
					</Tabs>
				</Box>

				<TabPanel value={selectedTab} index={0}>
					<GroupCreate onGroupCreated={handleGroupCreated} />
				</TabPanel>
				<TabPanel value={selectedTab} index={1}>
					<GroupJoin onGroupJoined={handleGroupJoined} />
				</TabPanel>
			</Paper>

			{/* Quick Info Cards */}
			<Grid container spacing={3} sx={{ mt: 4 }}>
				<Grid item xs={12} md={6}>
					<Card
						sx={{
							height: "100%",
							background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
							color: "white",
						}}
					>
						<CardContent sx={{ p: 3 }}>
							<GroupAddIcon sx={{ fontSize: 40, mb: 2 }} />
							<Typography variant="h6" gutterBottom>
								Create a Group
							</Typography>
							<Typography variant="body2" sx={{ opacity: 0.9 }}>
								Start a new adventure group with a unique ID and password.
								Perfect for organizing trips, events, or just staying connected
								with friends.
							</Typography>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} md={6}>
					<Card
						sx={{
							height: "100%",
							background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
							color: "white",
						}}
					>
						<CardContent sx={{ p: 3 }}>
							<LoginIcon sx={{ fontSize: 40, mb: 2 }} />
							<Typography variant="h6" gutterBottom>
								Join a Group
							</Typography>
							<Typography variant="body2" sx={{ opacity: 0.9 }}>
								Got an invitation? Enter the group ID and password to join your
								friends and start chatting about your upcoming adventures.
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* Features Info */}
			<Box sx={{ mt: 6, textAlign: "center" }}>
				<Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
					Why Use Group Chat?
				</Typography>
				<Grid container spacing={2} justifyContent="center">
					<Grid item xs={12} sm={4}>
						<Typography variant="body1" sx={{ mb: 1 }}>
							🔒 <strong>Secure</strong>
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Password-protected groups keep your conversations private
						</Typography>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Typography variant="body1" sx={{ mb: 1 }}>
							⚡ <strong>Real-time</strong>
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Instant messaging with live updates for all group members
						</Typography>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Typography variant="body1" sx={{ mb: 1 }}>
							🎯 <strong>Organized</strong>
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Keep all your group communication in one dedicated space
						</Typography>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
};

export default GroupChatLanding;
