import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import {
	Box,
	AppBar,
	Toolbar,
	Typography,
	Button,
	Container,
} from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import ThemeProvider from "./contexts/ThemeContext";
import { useAuth } from "./hooks/useAuth";
import ThemeToggle from "./components/ui/ThemeToggle";
import AuthModal from "./components/auth/AuthModal";

// Main App Content Component
const AppContent = () => {
	const { user, loading, signOut } = useAuth();
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [authMode, setAuthMode] = useState("login");

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

	const handleSignOut = async () => {
		await signOut();
	};

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<Typography variant="h6">Loading...</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" elevation={0}>
				<Toolbar>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1, fontWeight: "bold" }}
					>
						SyncroNauts
					</Typography>

					<ThemeToggle sx={{ mr: 1 }} />

					{user ? (
						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							<Typography variant="body2">Welcome, {user.email}</Typography>
							<Button color="inherit" onClick={handleSignOut}>
								Sign Out
							</Button>
						</Box>
					) : (
						<Box sx={{ display: "flex", gap: 1 }}>
							<Button color="inherit" onClick={handleOpenLogin}>
								Sign In
							</Button>
							<Button
								color="inherit"
								variant="outlined"
								onClick={handleOpenSignup}
								sx={{
									borderColor: "rgba(255, 255, 255, 0.5)",
									"&:hover": {
										borderColor: "white",
										backgroundColor: "rgba(255, 255, 255, 0.1)",
									},
								}}
							>
								Sign Up
							</Button>
						</Box>
					)}
				</Toolbar>
			</AppBar>

			<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
				{user ? (
					<Box>
						<Typography variant="h4" gutterBottom>
							Welcome to SyncroNauts! 🚀
						</Typography>
						<Typography variant="body1" color="text.secondary" paragraph>
							You're successfully authenticated and ready to start planning
							group outings!
						</Typography>
						<Box
							sx={{
								mt: 3,
								p: 3,
								backgroundColor: "background.paper",
								borderRadius: 2,
							}}
						>
							<Typography variant="h6" gutterBottom>
								Your Account Details:
							</Typography>
							<Typography variant="body2">
								<strong>Email:</strong> {user.email}
							</Typography>
							<Typography variant="body2">
								<strong>User ID:</strong> {user.id}
							</Typography>
							<Typography variant="body2">
								<strong>Account Created:</strong>{" "}
								{new Date(user.created_at).toLocaleDateString()}
							</Typography>
						</Box>
					</Box>
				) : (
					<Box sx={{ textAlign: "center", py: 8 }}>
						<Typography variant="h2" gutterBottom>
							Welcome to SyncroNauts
						</Typography>
						<Typography variant="h5" color="text.secondary" paragraph>
							Plan amazing group outings with your friends and family
						</Typography>
						<Typography
							variant="body1"
							color="text.secondary"
							paragraph
							sx={{ maxWidth: 600, mx: "auto" }}
						>
							Join our community to organize unforgettable adventures,
							coordinate schedules, and create lasting memories with your
							favorite people.
						</Typography>
						<Box
							sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}
						>
							<Button
								variant="contained"
								size="large"
								onClick={handleOpenSignup}
								sx={{ px: 4 }}
							>
								Get Started
							</Button>
							<Button
								variant="outlined"
								size="large"
								onClick={handleOpenLogin}
								sx={{ px: 4 }}
							>
								Sign In
							</Button>
						</Box>
					</Box>
				)}
			</Container>

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
