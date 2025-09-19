import React, { useState, useContext, useEffect } from "react";
import {
	Container,
	Typography,
	Box,
	Card,
	CardContent,
	Avatar,
	TextField,
	Button,
	Grid,
	Paper,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Switch,
	FormControlLabel,
	Divider,
	Chip,
	Badge,
	IconButton,
	LinearProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	Fade,
	useTheme,
	alpha,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
} from "@mui/material";
import {
	Person as PersonIcon,
	Email as EmailIcon,
	Phone as PhoneIcon,
	LocationOn as LocationIcon,
	Notifications as NotificationIcon,
	Security as SecurityIcon,
	Edit as EditIcon,
	CameraAlt as CameraIcon,
	Flight as FlightIcon,
	Group as GroupIcon,
	Star as StarIcon,
	Hiking as HikingIcon,
	WbSunny as BeachIcon,
	Terrain as MountainIcon,
	Camera as CameraPhotoIcon,
	RestaurantMenu as FoodIcon,
	LocalActivity as ActivityIcon,
	Badge as BadgeIcon,
	CalendarToday as CalendarIcon,
	TrendingUp as TrendingIcon,
	Save as SaveIcon,
	Close as CloseIcon,
	ContactEmergency as EmergencyIcon,
	Fastfood as DietIcon,
} from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import { storage } from "../lib/supabase";

const Profile = () => {
	const theme = useTheme();
	const { user, profile, member, updateProfile, updateMember, loading } =
		useContext(AuthContext);

	const [editing, setEditing] = useState(false);
	const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
	const [uploadingAvatar, setUploadingAvatar] = useState(false);
	const [profileData, setProfileData] = useState({
		full_name: "",
		username: "",
		bio: "",
		avatar_url: "",
	});

	const [memberData, setMemberData] = useState({
		phone: "",
		emergency_contact: "",
		dietary_restrictions: "",
		travel_preferences: "",
		adventure_level: "intermediate",
	});

	const [settings, setSettings] = useState({
		emailNotifications: true,
		pushNotifications: false,
		eventReminders: true,
		chatNotifications: true,
	});

	// Initialize data when profile/member loads
	useEffect(() => {
		if (profile) {
			setProfileData({
				full_name: profile.full_name || "",
				username: profile.username || "",
				bio: profile.bio || "",
				avatar_url: profile.avatar_url || "",
			});
		}

		if (member) {
			setMemberData({
				phone: member.phone || "",
				emergency_contact: member.emergency_contact || "",
				dietary_restrictions: member.dietary_restrictions || "",
				travel_preferences: member.travel_preferences || "",
				adventure_level: member.adventure_level || "intermediate",
			});
		}
	}, [profile, member]);

	const handleSave = async () => {
		try {
			// Update profile
			const profileResult = await updateProfile(profileData);
			if (profileResult.error) {
				console.error("Error updating profile:", profileResult.error);
				return;
			}

			// Update member data
			const memberResult = await updateMember(memberData);
			if (memberResult.error) {
				console.error("Error updating member:", memberResult.error);
				return;
			}

			setEditing(false);
		} catch (error) {
			console.error("Error saving profile:", error);
		}
	};

	const handleSettingChange = (setting) => {
		setSettings({
			...settings,
			[setting]: !settings[setting],
		});
	};

	const handleAvatarUpload = async (file) => {
		if (!user || !file) return;

		try {
			setUploadingAvatar(true);

			// Upload file to Supabase storage
			const { data, error } = await storage.uploadAvatar(user.id, file);

			if (error) {
				console.error("Error uploading avatar:", error);
				return;
			}

			// Update profile with new avatar URL
			const avatarPath = data.path;

			const profileResult = await updateProfile({
				...profileData,
				avatar_url: avatarPath,
			});

			if (profileResult.error) {
				console.error(
					"Error updating profile with avatar:",
					profileResult.error
				);
				return;
			}

			// Update local state
			setProfileData((prev) => ({
				...prev,
				avatar_url: avatarPath,
			}));

			setAvatarDialogOpen(false);
		} catch (error) {
			console.error("Error in avatar upload:", error);
		} finally {
			setUploadingAvatar(false);
		}
	};

	const adventureLevels = {
		beginner: { label: "Explorer", color: "#4caf50", icon: <LocationIcon /> },
		intermediate: {
			label: "Adventurer",
			color: "#ff9800",
			icon: <HikingIcon />,
		},
		advanced: {
			label: "Trailblazer",
			color: "#f44336",
			icon: <MountainIcon />,
		},
		expert: { label: "Legend", color: "#9c27b0", icon: <StarIcon /> },
	};

	// Dynamic travel stats calculation based on actual data
	const travelStats = {
		eventsJoined: member?.events_joined || 0,
		friendsMade: member?.connections_made || 0,
		citiesVisited: member?.cities_visited || 0,
		adventureScore: member?.adventure_score || 0,
	};

	if (loading) {
		return (
			<Container maxWidth="lg">
				<Box sx={{ mt: 4 }}>
					<LinearProgress />
					<Typography variant="h6" sx={{ mt: 2, textAlign: "center" }}>
						Loading your adventure profile...
					</Typography>
				</Box>
			</Container>
		);
	}

	return (
		<Fade in timeout={800}>
			<Container maxWidth="lg" sx={{ py: 4 }}>
				{/* Hero Section */}
				<Paper
					elevation={0}
					sx={{
						background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
						borderRadius: { xs: 2, sm: 4 },
						p: { xs: 2, sm: 3, md: 4 },
						mb: 4,
						position: "relative",
						overflow: "hidden",
						transition: "all 0.3s ease-in-out",
						"&:hover": {
							transform: "translateY(-2px)",
							boxShadow: 3,
						},
					}}
				>
					{/* Background Pattern */}
					<Box
						sx={{
							position: "absolute",
							top: 0,
							right: 0,
							width: 200,
							height: 200,
							background: `radial-gradient(circle, ${alpha(
								theme.palette.primary.main,
								0.1
							)} 0%, transparent 70%)`,
							borderRadius: "50%",
							transform: "translate(50px, -50px)",
						}}
					/>

					<Grid container spacing={4} alignItems="center">
						<Grid item xs={12} md={4}>
							<Box sx={{ textAlign: "center", position: "relative" }}>
								<Badge
									overlap="circular"
									anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
									badgeContent={
										<IconButton
											size="small"
											onClick={() => setAvatarDialogOpen(true)}
											sx={{
												bgcolor: "white",
												"&:hover": { bgcolor: "grey.100" },
												boxShadow: 2,
											}}
										>
											<CameraIcon fontSize="small" />
										</IconButton>
									}
								>
									<Avatar
										src={
											profileData.avatar_url
												? storage.getAvatarUrl(profileData.avatar_url)
												: null
										}
										sx={{
											width: 120,
											height: 120,
											mx: "auto",
											mb: 2,
											border: `4px solid white`,
											boxShadow: 3,
											fontSize: "2rem",
											fontWeight: 700,
										}}
									>
										{profileData.full_name
											?.split(" ")
											.map((n) => n[0])
											.join("") || user?.email?.[0]?.toUpperCase()}
									</Avatar>
								</Badge>

								<Typography variant="h4" fontWeight={700} gutterBottom>
									{profileData.full_name || "Adventure Seeker"}
								</Typography>

								<Typography variant="body1" color="text.secondary" gutterBottom>
									@{profileData.username || user?.email?.split("@")[0]}
								</Typography>

								{/* Adventure Level Badge */}
								<Chip
									icon={adventureLevels[memberData.adventure_level]?.icon}
									label={adventureLevels[memberData.adventure_level]?.label}
									sx={{
										mt: 1,
										bgcolor: adventureLevels[memberData.adventure_level]?.color,
										color: "white",
										fontWeight: 600,
									}}
								/>

								<Typography
									variant="body2"
									color="text.secondary"
									sx={{ mt: 1 }}
								>
									Member since{" "}
									{new Date(
										profile?.created_at || Date.now()
									).toLocaleDateString("en-US", {
										month: "long",
										year: "numeric",
									})}
								</Typography>
							</Box>
						</Grid>

						<Grid item xs={12} md={8}>
							{/* Travel Stats */}
							<Grid container spacing={3}>
								<Grid item xs={6} sm={3}>
									<Box sx={{ textAlign: "center" }}>
										<Typography variant="h4" fontWeight={700} color="primary">
											{travelStats.eventsJoined}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Adventures
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={6} sm={3}>
									<Box sx={{ textAlign: "center" }}>
										<Typography variant="h4" fontWeight={700} color="secondary">
											{travelStats.friendsMade}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Fellow Travelers
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={6} sm={3}>
									<Box sx={{ textAlign: "center" }}>
										<Typography
											variant="h4"
											fontWeight={700}
											color="success.main"
										>
											{travelStats.citiesVisited}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Cities Explored
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={6} sm={3}>
									<Box sx={{ textAlign: "center" }}>
										<Typography
											variant="h4"
											fontWeight={700}
											color="warning.main"
										>
											{travelStats.adventureScore}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Adventure Score
										</Typography>
									</Box>
								</Grid>
							</Grid>

							{/* Bio */}
							<Box sx={{ mt: 3 }}>
								<Typography variant="body1" sx={{ lineHeight: 1.7 }}>
									{profileData.bio ||
										"Ready to explore the world and create amazing memories with fellow adventurers! 🌍✈️"}
								</Typography>
							</Box>

							{/* Action Buttons */}
							<Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
								<Button
									variant={editing ? "outlined" : "contained"}
									startIcon={editing ? <CloseIcon /> : <EditIcon />}
									onClick={() => {
										if (editing) {
											// Reset data
											if (profile) {
												setProfileData({
													full_name: profile.full_name || "",
													username: profile.username || "",
													bio: profile.bio || "",
													avatar_url: profile.avatar_url || "",
												});
											}
											if (member) {
												setMemberData({
													phone: member.phone || "",
													emergency_contact: member.emergency_contact || "",
													dietary_restrictions:
														member.dietary_restrictions || "",
													travel_preferences: member.travel_preferences || "",
													adventure_level:
														member.adventure_level || "intermediate",
												});
											}
										}
										setEditing(!editing);
									}}
									size="large"
								>
									{editing ? "Cancel" : "Edit Profile"}
								</Button>

								{editing && (
									<Button
										variant="contained"
										startIcon={<SaveIcon />}
										onClick={handleSave}
										size="large"
										color="success"
									>
										Save Changes
									</Button>
								)}

								<Button
									variant="outlined"
									startIcon={<FlightIcon />}
									size="large"
								>
									Plan Adventure
								</Button>
							</Box>
						</Grid>
					</Grid>
				</Paper>

				<Grid container spacing={4}>
					{/* Personal Information Card */}
					<Grid item xs={12} md={6}>
						<Card sx={{ height: "100%" }}>
							<CardContent>
								<Typography
									variant="h6"
									gutterBottom
									sx={{ display: "flex", alignItems: "center", gap: 1 }}
								>
									<PersonIcon color="primary" />
									Personal Information
								</Typography>

								<Grid container spacing={2}>
									<Grid item xs={12}>
										<TextField
											fullWidth
											label="Full Name"
											value={profileData.full_name}
											onChange={(e) =>
												setProfileData({
													...profileData,
													full_name: e.target.value,
												})
											}
											disabled={!editing}
											variant="outlined"
										/>
									</Grid>

									<Grid item xs={12}>
										<TextField
											fullWidth
											label="Username"
											value={profileData.username}
											onChange={(e) =>
												setProfileData({
													...profileData,
													username: e.target.value,
												})
											}
											disabled={!editing}
											variant="outlined"
										/>
									</Grid>

									<Grid item xs={12}>
										<TextField
											fullWidth
											label="Email"
											value={user?.email || ""}
											disabled
											variant="outlined"
											helperText="Email cannot be changed"
										/>
									</Grid>

									<Grid item xs={12}>
										<TextField
											fullWidth
											label="Bio"
											multiline
											rows={3}
											value={profileData.bio}
											onChange={(e) =>
												setProfileData({ ...profileData, bio: e.target.value })
											}
											disabled={!editing}
											variant="outlined"
											placeholder="Tell us about your adventure spirit..."
										/>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Grid>

					{/* Travel & Adventure Info */}
					<Grid item xs={12} md={6}>
						<Card sx={{ height: "100%" }}>
							<CardContent>
								<Typography
									variant="h6"
									gutterBottom
									sx={{ display: "flex", alignItems: "center", gap: 1 }}
								>
									<HikingIcon color="primary" />
									Adventure Details
								</Typography>

								<Grid container spacing={2}>
									<Grid item xs={12}>
										<TextField
											fullWidth
											label="Phone Number"
											value={memberData.phone}
											onChange={(e) =>
												setMemberData({ ...memberData, phone: e.target.value })
											}
											disabled={!editing}
											variant="outlined"
											placeholder="+1 (555) 123-4567"
										/>
									</Grid>

									<Grid item xs={12}>
										<TextField
											fullWidth
											label="Emergency Contact"
											value={memberData.emergency_contact}
											onChange={(e) =>
												setMemberData({
													...memberData,
													emergency_contact: e.target.value,
												})
											}
											disabled={!editing}
											variant="outlined"
											placeholder="Name and phone number"
										/>
									</Grid>

									<Grid item xs={12}>
										<FormControl fullWidth disabled={!editing}>
											<InputLabel>Adventure Level</InputLabel>
											<Select
												value={memberData.adventure_level}
												label="Adventure Level"
												onChange={(e) =>
													setMemberData({
														...memberData,
														adventure_level: e.target.value,
													})
												}
											>
												<MenuItem value="beginner">
													Explorer - New to adventures
												</MenuItem>
												<MenuItem value="intermediate">
													Adventurer - Some experience
												</MenuItem>
												<MenuItem value="advanced">
													Trailblazer - Very experienced
												</MenuItem>
												<MenuItem value="expert">
													Legend - Expert level
												</MenuItem>
											</Select>
										</FormControl>
									</Grid>

									<Grid item xs={12}>
										<TextField
											fullWidth
											label="Dietary Restrictions"
											value={memberData.dietary_restrictions}
											onChange={(e) =>
												setMemberData({
													...memberData,
													dietary_restrictions: e.target.value,
												})
											}
											disabled={!editing}
											variant="outlined"
											placeholder="Vegetarian, allergies, etc."
										/>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Grid>

					{/* Travel Preferences */}
					<Grid item xs={12}>
						<Card>
							<CardContent>
								<Typography
									variant="h6"
									gutterBottom
									sx={{ display: "flex", alignItems: "center", gap: 1 }}
								>
									<BeachIcon color="primary" />
									Travel Preferences
								</Typography>

								<TextField
									fullWidth
									label="What kind of adventures excite you?"
									multiline
									rows={3}
									value={memberData.travel_preferences}
									onChange={(e) =>
										setMemberData({
											...memberData,
											travel_preferences: e.target.value,
										})
									}
									disabled={!editing}
									variant="outlined"
									placeholder="Hiking, beach trips, city exploration, food tours, photography, outdoor sports..."
									sx={{ mb: 3 }}
								/>

								{/* Travel Interest Tags */}
								<Typography variant="subtitle2" gutterBottom>
									Adventure Interests
								</Typography>
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
									{memberData.travel_preferences ? (
										memberData.travel_preferences
											.split(",")
											.map((preference, index) => {
												const trimmedPref = preference.trim();
												// Map preferences to appropriate icons
												const getIconForPreference = (pref) => {
													const lowerPref = pref.toLowerCase();
													if (lowerPref.includes("hiking"))
														return <HikingIcon />;
													if (lowerPref.includes("beach")) return <BeachIcon />;
													if (lowerPref.includes("mountain"))
														return <MountainIcon />;
													if (lowerPref.includes("photo"))
														return <CameraPhotoIcon />;
													if (lowerPref.includes("food")) return <FoodIcon />;
													if (
														lowerPref.includes("city") ||
														lowerPref.includes("location")
													)
														return <LocationIcon />;
													if (
														lowerPref.includes("sport") ||
														lowerPref.includes("activity")
													)
														return <ActivityIcon />;
													return <StarIcon />;
												};

												return (
													<Chip
														key={index}
														icon={getIconForPreference(trimmedPref)}
														label={trimmedPref}
														variant="outlined"
														sx={{
															"&:hover": {
																bgcolor: theme.palette.primary.main,
																color: "white",
																"& .MuiChip-icon": { color: "white" },
															},
														}}
													/>
												);
											})
									) : (
										<Typography variant="body2" color="text.secondary">
											No travel preferences set. Edit your profile to add some!
										</Typography>
									)}
								</Box>
							</CardContent>
						</Card>
					</Grid>

					{/* Notification Settings */}
					<Grid item xs={12}>
						<Card>
							<CardContent>
								<Typography
									variant="h6"
									gutterBottom
									sx={{ display: "flex", alignItems: "center", gap: 1 }}
								>
									<NotificationIcon color="primary" />
									Notification Settings
								</Typography>

								<List>
									<ListItem>
										<ListItemIcon>
											<EmailIcon />
										</ListItemIcon>
										<ListItemText
											primary="Email Notifications"
											secondary="Receive notifications via email"
										/>
										<FormControlLabel
											control={
												<Switch
													checked={settings.emailNotifications}
													onChange={() =>
														handleSettingChange("emailNotifications")
													}
												/>
											}
											label=""
										/>
									</ListItem>

									<Divider />

									<ListItem>
										<ListItemIcon>
											<NotificationIcon />
										</ListItemIcon>
										<ListItemText
											primary="Push Notifications"
											secondary="Receive push notifications on your device"
										/>
										<FormControlLabel
											control={
												<Switch
													checked={settings.pushNotifications}
													onChange={() =>
														handleSettingChange("pushNotifications")
													}
												/>
											}
											label=""
										/>
									</ListItem>

									<Divider />

									<ListItem>
										<ListItemIcon>
											<CalendarIcon />
										</ListItemIcon>
										<ListItemText
											primary="Event Reminders"
											secondary="Get reminded about upcoming events"
										/>
										<FormControlLabel
											control={
												<Switch
													checked={settings.eventReminders}
													onChange={() => handleSettingChange("eventReminders")}
												/>
											}
											label=""
										/>
									</ListItem>

									<Divider />

									<ListItem>
										<ListItemIcon>
											<GroupIcon />
										</ListItemIcon>
										<ListItemText
											primary="Chat Notifications"
											secondary="Get notified about new chat messages"
										/>
										<FormControlLabel
											control={
												<Switch
													checked={settings.chatNotifications}
													onChange={() =>
														handleSettingChange("chatNotifications")
													}
												/>
											}
											label=""
										/>
									</ListItem>
								</List>
							</CardContent>
						</Card>
					</Grid>
				</Grid>

				{/* Avatar Upload Dialog */}
				<Dialog
					open={avatarDialogOpen}
					onClose={() => setAvatarDialogOpen(false)}
					maxWidth="sm"
					fullWidth
				>
					<DialogTitle sx={{ textAlign: "center" }}>
						<CameraIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
						<Typography variant="h5" component="div">
							Update Profile Picture
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Choose a photo that represents your adventure spirit
						</Typography>
					</DialogTitle>
					<DialogContent>
						<Box sx={{ textAlign: "center", p: 3 }}>
							<Avatar
								src={
									profileData.avatar_url
										? storage.getAvatarUrl(profileData.avatar_url)
										: null
								}
								sx={{
									width: 120,
									height: 120,
									mx: "auto",
									mb: 3,
									border: `3px solid ${theme.palette.primary.main}`,
									fontSize: "2rem",
								}}
							>
								{profileData.full_name
									?.split(" ")
									.map((n) => n[0])
									.join("") || user?.email?.[0]?.toUpperCase()}
							</Avatar>

							<Box
								sx={{
									display: "flex",
									gap: 2,
									justifyContent: "center",
									flexWrap: "wrap",
								}}
							>
								<Button
									variant="contained"
									component="label"
									startIcon={<CameraIcon />}
									disabled={uploadingAvatar}
									sx={{ mb: 1 }}
								>
									{uploadingAvatar ? "Uploading..." : "Choose Photo"}
									<input
										type="file"
										hidden
										accept="image/*"
										onChange={(e) => {
											const file = e.target.files[0];
											if (file) {
												handleAvatarUpload(file);
											}
										}}
									/>
								</Button>

								<Button
									variant="outlined"
									onClick={() => setAvatarDialogOpen(false)}
									disabled={uploadingAvatar}
								>
									Cancel
								</Button>
							</Box>

							<Typography
								variant="caption"
								color="text.secondary"
								sx={{ mt: 2, display: "block" }}
							>
								Supported formats: JPG, PNG, GIF (max 5MB)
							</Typography>
						</Box>
					</DialogContent>
				</Dialog>

				{/* Adventure Statistics */}
				<Grid container spacing={3} sx={{ mt: 2 }}>
					<Grid item xs={12} md={6}>
						<Card
							sx={{
								background: `linear-gradient(135deg, ${theme.palette.success.main}15 0%, ${theme.palette.info.main}15 100%)`,
								border: "1px solid",
								borderColor: alpha(theme.palette.success.main, 0.2),
							}}
						>
							<CardContent>
								<Typography
									variant="h6"
									gutterBottom
									sx={{ display: "flex", alignItems: "center", gap: 1 }}
								>
									<TrendingIcon color="success" />
									Adventure Timeline
								</Typography>

								<List sx={{ py: 0 }}>
									<ListItem sx={{ px: 0 }}>
										<ListItemIcon>
											<CalendarIcon color="primary" />
										</ListItemIcon>
										<ListItemText
											primary="Recent Adventure"
											secondary="Weekend Hiking Trip - Mount Wilson"
											secondaryTypographyProps={{ color: "text.secondary" }}
										/>
										<Typography variant="caption" color="text.secondary">
											2 days ago
										</Typography>
									</ListItem>

									<ListItem sx={{ px: 0 }}>
										<ListItemIcon>
											<GroupIcon color="secondary" />
										</ListItemIcon>
										<ListItemText
											primary="Joined New Group"
											secondary="Beach Cleanup Volunteers"
											secondaryTypographyProps={{ color: "text.secondary" }}
										/>
										<Typography variant="caption" color="text.secondary">
											1 week ago
										</Typography>
									</ListItem>

									<ListItem sx={{ px: 0 }}>
										<ListItemIcon>
											<BadgeIcon color="warning" />
										</ListItemIcon>
										<ListItemText
											primary="Achievement Unlocked"
											secondary="First Mountain Summit"
											secondaryTypographyProps={{ color: "text.secondary" }}
										/>
										<Typography variant="caption" color="text.secondary">
											2 weeks ago
										</Typography>
									</ListItem>
								</List>
							</CardContent>
						</Card>
					</Grid>

					<Grid item xs={12} md={6}>
						<Card
							sx={{
								background: `linear-gradient(135deg, ${theme.palette.warning.main}15 0%, ${theme.palette.error.main}15 100%)`,
								border: "1px solid",
								borderColor: alpha(theme.palette.warning.main, 0.2),
							}}
						>
							<CardContent>
								<Typography
									variant="h6"
									gutterBottom
									sx={{ display: "flex", alignItems: "center", gap: 1 }}
								>
									<StarIcon color="warning" />
									Adventure Badges
								</Typography>

								<Box
									sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 2 }}
								>
									{[
										{ label: "First Timer", color: "#4caf50", icon: "🌟" },
										{ label: "Group Leader", color: "#ff9800", icon: "👑" },
										{ label: "Photo Master", color: "#2196f3", icon: "📸" },
										{ label: "Trail Blazer", color: "#f44336", icon: "🥾" },
										{ label: "Beach Walker", color: "#00bcd4", icon: "🏖️" },
										{ label: "City Explorer", color: "#9c27b0", icon: "🏙️" },
									].map((badge, index) => (
										<Chip
											key={index}
											label={
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														gap: 0.5,
													}}
												>
													<span>{badge.icon}</span>
													<span>{badge.label}</span>
												</Box>
											}
											sx={{
												bgcolor: badge.color,
												color: "white",
												fontWeight: 600,
												"& .MuiChip-label": {
													fontSize: "0.75rem",
												},
											}}
											size="small"
										/>
									))}
								</Box>

								<Typography
									variant="body2"
									color="text.secondary"
									sx={{ mt: 2 }}
								>
									Complete more adventures to unlock new badges!
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Container>
		</Fade>
	);
};

export default Profile;
