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
} from "@mui/material";
import {
	GroupAdd as GroupAddIcon,
	VpnKey as VpnKeyIcon,
	Celebration as CelebrationIcon,
} from "@mui/icons-material";
import { useGroupChat } from "../hooks/useGroupChat";

const GroupCreate = ({ onGroupCreated }) => {
	const [groupName, setGroupName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const [createdGroupId, setCreatedGroupId] = useState(null);

	const { createGroup, error, setError } = useGroupChat();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// Validation
		if (!groupName.trim()) {
			setError("Group name is required");
			return;
		}

		if (!password) {
			setError("Password is required");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (password.length < 4) {
			setError("Password must be at least 4 characters long");
			return;
		}

		setIsCreating(true);

		try {
			const groupId = await createGroup(groupName.trim(), password);
			if (groupId) {
				setCreatedGroupId(groupId);
				// Call parent callback if provided
				if (onGroupCreated) {
					onGroupCreated(groupId);
				}
			}
		} catch (err) {
			console.error("Error creating group:", err);
		} finally {
			setIsCreating(false);
		}
	};

	// Show success state with created group ID
	if (createdGroupId) {
		return (
			<Container maxWidth="sm">
				<Card
					sx={{
						mt: 4,
						background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
						color: "white",
					}}
				>
					<CardContent sx={{ textAlign: "center", p: 4 }}>
						<CelebrationIcon sx={{ fontSize: 60, mb: 2, color: "#ffd700" }} />
						<Typography variant="h4" gutterBottom>
							Adventure Group Created!
						</Typography>
						<Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
							Your group is ready for epic adventures together
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
								Group ID
							</Typography>
							<Chip
								label={createdGroupId}
								sx={{
									fontSize: "1.1rem",
									fontWeight: "bold",
									bgcolor: "rgba(255,255,255,0.9)",
									color: "#1976d2",
									px: 2,
									py: 1,
									height: "auto",
								}}
							/>
							<Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
								Share this ID with your adventure buddies!
							</Typography>
						</Box>

						<Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
							Save this Group ID - you'll need it to share with others so they
							can join your adventure!
						</Typography>

						<Button
							variant="contained"
							onClick={() => {
								if (onGroupCreated) {
									onGroupCreated(createdGroupId);
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
					background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
				}}
			>
				<Box sx={{ textAlign: "center", mb: 3 }}>
					<GroupAddIcon sx={{ fontSize: 48, color: "#1976d2", mb: 1 }} />
					<Typography variant="h4" gutterBottom>
						Create Adventure Group
					</Typography>
					<Typography variant="body1" color="text.secondary">
						Start a new group for your next epic journey
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
								label="Group Name"
								value={groupName}
								onChange={(e) => setGroupName(e.target.value)}
								placeholder="e.g., Weekend Warriors, Mountain Explorers"
								disabled={isCreating}
								variant="outlined"
								InputProps={{
									startAdornment: (
										<GroupAddIcon sx={{ mr: 1, color: "action.active" }} />
									),
								}}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								type="password"
								label="Group Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Create a secure password"
								disabled={isCreating}
								variant="outlined"
								InputProps={{
									startAdornment: (
										<VpnKeyIcon sx={{ mr: 1, color: "action.active" }} />
									),
								}}
								helperText="Minimum 4 characters. Share this with group members."
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								type="password"
								label="Confirm Password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="Confirm your password"
								disabled={isCreating}
								variant="outlined"
								InputProps={{
									startAdornment: (
										<VpnKeyIcon sx={{ mr: 1, color: "action.active" }} />
									),
								}}
							/>
						</Grid>

						<Grid item xs={12}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								size="large"
								disabled={isCreating}
								sx={{
									py: 1.5,
									background:
										"linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
									"&:hover": {
										background:
											"linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)",
									},
								}}
							>
								{isCreating ? "Creating Group..." : "Create Adventure Group"}
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
							💡 <strong>Tip:</strong> After creating your group, you'll get a
							unique Group ID. Share this ID and password with your friends so
							they can join your adventure!
						</Typography>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
};

export default GroupCreate;
