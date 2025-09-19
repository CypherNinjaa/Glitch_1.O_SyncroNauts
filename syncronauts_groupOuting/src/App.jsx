import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import {
	Box,
	AppBar,
	Toolbar,
	Typography,
	Button,
	Container,
	Grid,
	Card,
	CardContent,
	Avatar,
	Paper,
	useTheme,
	useMediaQuery,
	Stack,
	Chip,
	IconButton,
} from "@mui/material";
import {
	Explore as ExploreIcon,
	Group as GroupIcon,
	Event as EventIcon,
	AttachMoney as MoneyIcon,
	Chat as ChatIcon,
	LocationOn as LocationIcon,
	Schedule as ScheduleIcon,
	Star as StarIcon,
	ArrowForward as ArrowForwardIcon,
	TravelExplore as TravelIcon,
	Hiking as HikingIcon,
	BeachAccess as BeachIcon,
	Restaurant as RestaurantIcon,
	DirectionsCar as CarIcon,
	CameraAlt as CameraIcon,
} from "@mui/icons-material";
import { AuthProvider } from "./contexts/AuthContext";
import ThemeProvider from "./contexts/ThemeContext";
import { useAuth } from "./hooks/useAuth";
import AuthModal from "./components/auth/AuthModal";
import MainLayout from "./layout/MainLayout";
import ThemeToggle from "./components/ui/ThemeToggle";

// Main App Content Component
const AppContent = () => {
	const { user, loading } = useAuth();
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [authMode, setAuthMode] = useState("login");
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const handleOpenLogin = () => {
		setAuthMode("login");
		setAuthModalOpen(true);
	};

	const handleOpenSignup = () => {
		setAuthMode("signup");
		setAuthModalOpen(true);
	};

	const handleCloseAuth = () => {
		setAuthModalOpen(false);
	};

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
				}}
			>
				<Box sx={{ textAlign: "center", color: "white" }}>
					<TravelIcon sx={{ fontSize: 48, mb: 2 }} />
					<Typography variant="h6">Loading your adventure...</Typography>
				</Box>
			</Box>
		);
	}

	return (
		<Box sx={{ flexGrow: 1 }}>
			{user ? (
				<MainLayout />
			) : (
				<Box
					sx={{
						minHeight: "100vh",
						background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
						position: "relative",
						overflow: "hidden",
					}}
				>
					{/* Header */}
					<AppBar
						position="static"
						elevation={0}
						sx={{
							background: "rgba(255, 255, 255, 0.95)",
							backdropFilter: "blur(20px)",
							borderBottom: "1px solid rgba(99, 102, 241, 0.1)",
						}}
					>
						<Toolbar sx={{ py: 1 }}>
							<Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
								<Box
									sx={{
										p: 1.5,
										borderRadius: 2,
										background:
											"linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
										mr: 2,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<TravelIcon sx={{ color: "white", fontSize: 24 }} />
								</Box>
								<Typography
									variant="h6"
									component="div"
									sx={{
										fontWeight: 700,
										color: "text.primary",
										fontSize: "1.5rem",
									}}
								>
									SyncroNauts
								</Typography>
							</Box>

							<ThemeToggle sx={{ mr: 2 }} />

							<Box sx={{ display: "flex", gap: 1 }}>
								<Button
									color="primary"
									onClick={handleOpenLogin}
									sx={{
										fontWeight: 600,
										color: "text.primary",
										"&:hover": {
											backgroundColor: "rgba(99, 102, 241, 0.08)",
										},
									}}
								>
									Sign In
								</Button>
								<Button
									variant="contained"
									onClick={handleOpenSignup}
									sx={{
										background:
											"linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
										fontWeight: 600,
										px: 3,
										borderRadius: 2,
										"&:hover": {
											background:
												"linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
										},
									}}
								>
									Sign Up
								</Button>
							</Box>
						</Toolbar>
					</AppBar>

					{/* Hero Section */}
					<Container maxWidth="lg" sx={{ pt: isMobile ? 4 : 8, pb: 4 }}>
						<Grid container spacing={4} alignItems="center">
							<Grid item xs={12} md={6}>
								<Box sx={{ textAlign: isMobile ? "center" : "left" }}>
									<Chip
										label="🌟 #1 Group Planning Platform"
										sx={{
											background:
												"linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
											border: "1px solid rgba(99, 102, 241, 0.2)",
											color: "primary.main",
											fontWeight: 600,
											mb: 3,
											fontSize: "0.875rem",
										}}
									/>
									<Typography
										variant={isMobile ? "h3" : "h2"}
										component="h1"
										sx={{
											fontWeight: 800,
											mb: 3,
											background:
												"linear-gradient(135deg, #1e293b 0%, #475569 100%)",
											backgroundClip: "text",
											WebkitBackgroundClip: "text",
											WebkitTextFillColor: "transparent",
											lineHeight: 1.1,
										}}
									>
										Plan Epic Adventures
										<br />
										<Box
											component="span"
											sx={{
												background:
													"linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
												backgroundClip: "text",
												WebkitBackgroundClip: "text",
												WebkitTextFillColor: "transparent",
											}}
										>
											Together
										</Box>
									</Typography>
									<Typography
										variant="h6"
										color="text.secondary"
										sx={{
											mb: 4,
											lineHeight: 1.6,
											fontWeight: 400,
											maxWidth: 500,
										}}
									>
										Create unforgettable group experiences. From mountain hikes
										to beach days, coordinate every detail with your squad in
										one beautiful platform.
									</Typography>
									<Stack
										direction={isMobile ? "column" : "row"}
										spacing={2}
										sx={{ mb: 4 }}
									>
										<Button
											variant="contained"
											size="large"
											onClick={handleOpenSignup}
											endIcon={<ArrowForwardIcon />}
											sx={{
												px: 4,
												py: 1.5,
												borderRadius: 3,
												background:
													"linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
												fontWeight: 600,
												fontSize: "1.1rem",
												"&:hover": {
													background:
														"linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
													transform: "translateY(-2px)",
													boxShadow: "0 8px 25px rgba(99, 102, 241, 0.4)",
												},
												transition: "all 0.2s ease-in-out",
											}}
										>
											Start Your Adventure
										</Button>
										<Button
											variant="outlined"
											size="large"
											onClick={handleOpenLogin}
											sx={{
												px: 4,
												py: 1.5,
												borderRadius: 3,
												fontWeight: 600,
												fontSize: "1.1rem",
												borderWidth: 2,
												"&:hover": {
													borderWidth: 2,
													transform: "translateY(-2px)",
													boxShadow: "0 8px 25px rgba(99, 102, 241, 0.2)",
												},
												transition: "all 0.2s ease-in-out",
											}}
										>
											Sign In
										</Button>
									</Stack>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 1,
											justifyContent: isMobile ? "center" : "flex-start",
										}}
									>
										<Typography variant="body2" color="text.secondary">
											Trusted by 10,000+ adventure seekers
										</Typography>
										<Box sx={{ display: "flex", gap: 0.5 }}>
											{[1, 2, 3, 4, 5].map((star) => (
												<StarIcon
													key={star}
													sx={{ color: "#fbbf24", fontSize: 16 }}
												/>
											))}
										</Box>
									</Box>
								</Box>
							</Grid>
							<Grid item xs={12} md={6}>
								<Box
									sx={{
										position: "relative",
										display: "flex",
										justifyContent: "center",
										mt: isMobile ? 4 : 0,
									}}
								>
									{/* Adventure Cards */}
									<Box
										sx={{
											position: "relative",
											transform: "rotate(-5deg)",
											"&:hover": {
												transform: "rotate(-2deg) scale(1.02)",
											},
											transition: "all 0.3s ease-in-out",
										}}
									>
										<Card
											sx={{
												width: 280,
												borderRadius: 4,
												boxShadow: "0 20px 60px rgba(99, 102, 241, 0.3)",
												background:
													"linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
												border: "1px solid rgba(99, 102, 241, 0.1)",
											}}
										>
											<CardContent sx={{ p: 3 }}>
												<Box
													sx={{ display: "flex", alignItems: "center", mb: 2 }}
												>
													<Avatar
														sx={{
															bgcolor: "#10b981",
															mr: 2,
															width: 48,
															height: 48,
														}}
													>
														<HikingIcon />
													</Avatar>
													<Box>
														<Typography variant="h6" sx={{ fontWeight: 700 }}>
															Mountain Hike
														</Typography>
														<Typography variant="body2" color="text.secondary">
															This Weekend
														</Typography>
													</Box>
												</Box>
												<Typography
													variant="body2"
													color="text.secondary"
													sx={{ mb: 2 }}
												>
													Epic sunrise hike with the crew! 🏔️
												</Typography>
												<Box
													sx={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
													}}
												>
													<Box sx={{ display: "flex", gap: 1 }}>
														<Chip
															label="8 going"
															size="small"
															color="success"
														/>
														<Chip
															label="$25/person"
															size="small"
															color="primary"
														/>
													</Box>
												</Box>
											</CardContent>
										</Card>
									</Box>

									<Box
										sx={{
											position: "absolute",
											top: 60,
											right: -20,
											transform: "rotate(8deg)",
											"&:hover": {
												transform: "rotate(5deg) scale(1.02)",
											},
											transition: "all 0.3s ease-in-out",
										}}
									>
										<Card
											sx={{
												width: 240,
												borderRadius: 4,
												boxShadow: "0 15px 40px rgba(139, 92, 246, 0.3)",
												background:
													"linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)",
												border: "1px solid rgba(139, 92, 246, 0.1)",
											}}
										>
											<CardContent sx={{ p: 2.5 }}>
												<Box
													sx={{ display: "flex", alignItems: "center", mb: 2 }}
												>
													<Avatar
														sx={{
															bgcolor: "#3b82f6",
															mr: 2,
															width: 40,
															height: 40,
														}}
													>
														<BeachIcon />
													</Avatar>
													<Box>
														<Typography
															variant="subtitle1"
															sx={{ fontWeight: 600 }}
														>
															Beach Day
														</Typography>
														<Typography
															variant="caption"
															color="text.secondary"
														>
															Next Month
														</Typography>
													</Box>
												</Box>
												<Box sx={{ display: "flex", gap: 1 }}>
													<Chip
														label="12 interested"
														size="small"
														color="info"
													/>
												</Box>
											</CardContent>
										</Card>
									</Box>
								</Box>
							</Grid>
						</Grid>
					</Container>

					{/* CTA Section */}
					<Container maxWidth="lg" sx={{ py: isMobile ? 6 : 10 }}>
						<Paper
							sx={{
								p: isMobile ? 4 : 8,
								textAlign: "center",
								borderRadius: 6,
								background:
									"linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)",
								border: "2px solid rgba(99, 102, 241, 0.1)",
								position: "relative",
								overflow: "hidden",
							}}
						>
							<Typography
								variant="h3"
								component="h2"
								sx={{
									fontWeight: 700,
									mb: 2,
									color: "text.primary",
								}}
							>
								Ready for Your Next Adventure?
							</Typography>
							<Typography
								variant="h6"
								color="text.secondary"
								sx={{ mb: 4, maxWidth: 600, mx: "auto", fontWeight: 400 }}
							>
								Join thousands of groups already planning their next epic outing
								with SyncroNauts
							</Typography>
							<Button
								variant="contained"
								size="large"
								onClick={handleOpenSignup}
								endIcon={<ArrowForwardIcon />}
								sx={{
									px: 6,
									py: 2,
									borderRadius: 4,
									background:
										"linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
									fontWeight: 600,
									fontSize: "1.2rem",
									"&:hover": {
										background:
											"linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
										transform: "translateY(-3px)",
										boxShadow: "0 12px 40px rgba(99, 102, 241, 0.4)",
									},
									transition: "all 0.3s ease-in-out",
								}}
							>
								Start Planning Today
							</Button>
						</Paper>
					</Container>
				</Box>
			)}

			<AuthModal
				open={authModalOpen}
				onClose={handleCloseAuth}
				initialMode={authMode}
			/>
		</Box>
	);
};

function App() {
	return (
		<ThemeProvider>
			<AuthProvider>
				<Router>
					<AppContent />
				</Router>
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;
