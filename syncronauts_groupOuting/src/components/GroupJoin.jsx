import React, { useState } from "react";
import {
	Box,
	Paper,
	Typography,
	TextField,
	Button,
	Alert,
	Container,
	Card,
	CardContent,
	Grid,
	Chip,
	CircularProgress,
} from "@mui/material";
import {
	Login as LoginIcon,
	VpnKey as VpnKeyIcon,
	Group as GroupIcon,
	Check as CheckIcon,
} from "@mui/icons-material";
import { useGroupChat } from "../hooks/useGroupChat";

const GroupJoin = ({ onGroupJoined }) => {
	const [groupId, setGroupId] = useState("");
	const [password, setPassword] = useState("");
	const [isJoining, setIsJoining] = useState(false);
	const [joinSuccess, setJoinSuccess] = useState(false);

	const { enterGroup, error, setError, currentGroup } = useGroupChat();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// Validation
		if (!groupId.trim()) {
			setError("Group ID is required");
			return;
		}

		if (!password) {
			setError("Password is required");
			return;
		}

		setIsJoining(true);

		try {
			const success = await enterGroup(groupId.trim(), password);
			if (success) {
				setJoinSuccess(true);
				// Call parent callback after a short delay to show success
				setTimeout(() => {
					if (onGroupJoined) {
						onGroupJoined(groupId.trim());
					}
				}, 1500);
			}
		} catch (err) {
			console.error("Error joining group:", err);
		} finally {
			setIsJoining(false);
		}
	};

	// Show success state
	if (joinSuccess && currentGroup) {
		return (
			<Container maxWidth="sm">
				<Card
					sx={{
						mt: 4,
						background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
						color: "white",
					}}
				>
					<CardContent sx={{ textAlign: "center", p: 4 }}>
						<CheckIcon sx={{ fontSize: 60, mb: 2, color: "#fff" }} />
						<Typography variant="h4" gutterBottom>
							Welcome to the Adventure!
						</Typography>
						<Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
							You've successfully joined the group
						</Typography>

						<Box
							sx={{
								bgcolor: "rgba(255,255,255,0.1)",
								borderRadius: 2,
								p: 3,
								mb: 3,
								backdropFilter: "blur(10px)",
							}}
						>
							<Typography variant="h6" gutterBottom>
								{currentGroup.group_name}
							</Typography>
							<Chip
								label={`Group ID: ${currentGroup.group_id}`}
								sx={{
									fontSize: "1rem",
									fontWeight: "bold",
									bgcolor: "rgba(255,255,255,0.9)",
									color: "#4CAF50",
									px: 2,
									py: 1,
									height: "auto",
								}}
							/>
						</Box>

						<Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
							Ready to start chatting with your adventure buddies!
						</Typography>

						<Button
							variant="contained"
							onClick={() => {
								if (onGroupJoined) {
									onGroupJoined(currentGroup.group_id);
								}
							}}
							sx={{
								bgcolor: "rgba(255,255,255,0.2)",
								"&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
								backdropFilter: "blur(10px)",
							}}
						>
							Start Chatting
						</Button>
					</CardContent>
				</Card>
			</Container>
		);
	}

	return (
		<Container maxWidth="sm">
			<Paper
				elevation={3}
				sx={{
					p: 4,
					mt: 4,
					background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
				}}
			>
				<Box sx={{ textAlign: "center", mb: 3 }}>
					<LoginIcon sx={{ fontSize: 48, color: "#1976d2", mb: 1 }} />
					<Typography variant="h4" gutterBottom>
						Join Adventure Group
					</Typography>
					<Typography variant="body1" color="text.secondary">
						Enter your group details to join the adventure
					</Typography>
				</Box>

				{error && (
					<Alert severity="error" sx={{ mb: 3 }}>
						{error}
					</Alert>
				)}

				<Box component="form" onSubmit={handleSubmit}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label="Group ID"
								value={groupId}
								onChange={(e) => setGroupId(e.target.value)}
								placeholder="e.g., epic-squad-2025"
								disabled={isJoining}
								variant="outlined"
								InputProps={{
									startAdornment: (
										<GroupIcon sx={{ mr: 1, color: "action.active" }} />
									),
								}}
								helperText="Ask your group organizer for the Group ID"
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								type="password"
								label="Group Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter group password"
								disabled={isJoining}
								variant="outlined"
								InputProps={{
									startAdornment: (
										<VpnKeyIcon sx={{ mr: 1, color: "action.active" }} />
									),
								}}
								helperText="Password provided by your group organizer"
							/>
						</Grid>

						<Grid item xs={12}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								size="large"
								disabled={isJoining}
								sx={{
									py: 1.5,
									background:
										"linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
									"&:hover": {
										background:
											"linear-gradient(45deg, #2196F3 60%, #21CBF3 100%)",
									},
								}}
							>
								{isJoining ? (
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<CircularProgress
											size={20}
											sx={{ mr: 1, color: "white" }}
										/>
										Joining Group...
									</Box>
								) : (
									"Join Adventure Group"
								)}
							</Button>
						</Grid>
					</Grid>

					<Box
						sx={{
							mt: 3,
							p: 2,
							bgcolor: "rgba(25, 118, 210, 0.1)",
							borderRadius: 1,
						}}
					>
						<Typography variant="body2" color="text.secondary">
							🎒 <strong>Adventure Awaits:</strong> Once you join, you'll be
							able to chat with all group members and coordinate your next
							adventure together!
						</Typography>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
};

export default GroupJoin;
