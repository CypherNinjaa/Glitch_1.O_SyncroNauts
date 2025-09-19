import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	IconButton,
	Box,
	Fade,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthModal = ({ open, onClose, initialMode = "login" }) => {
	const [mode, setMode] = useState(initialMode);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const handleSwitchToSignup = () => {
		setMode("signup");
	};

	const handleSwitchToLogin = () => {
		setMode("login");
	};

	const handleClose = () => {
		setMode("login"); // Reset to login mode when closing
		onClose();
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="sm"
			fullWidth
			fullScreen={isMobile}
			sx={{
				"& .MuiDialog-paper": {
					borderRadius: isMobile ? 0 : 2,
					minHeight: isMobile ? "100vh" : "auto",
				},
			}}
			TransitionComponent={Fade}
			transitionDuration={300}
		>
			<Box sx={{ position: "relative" }}>
				<IconButton
					aria-label="close"
					onClick={handleClose}
					sx={{
						position: "absolute",
						right: 8,
						top: 8,
						zIndex: 1,
						backgroundColor: "rgba(0, 0, 0, 0.04)",
						"&:hover": {
							backgroundColor: "rgba(0, 0, 0, 0.08)",
						},
					}}
				>
					<Close />
				</IconButton>

				<DialogContent sx={{ p: 0, overflow: "hidden" }}>
					<Box
						sx={{
							minHeight: isMobile ? "100vh" : "600px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							p: isMobile ? 2 : 3,
						}}
					>
						{mode === "login" ? (
							<LoginForm
								onSwitchToSignup={handleSwitchToSignup}
								onClose={handleClose}
							/>
						) : (
							<SignupForm
								onSwitchToLogin={handleSwitchToLogin}
								onClose={handleClose}
							/>
						)}
					</Box>
				</DialogContent>
			</Box>
		</Dialog>
	);
};

export default AuthModal;
