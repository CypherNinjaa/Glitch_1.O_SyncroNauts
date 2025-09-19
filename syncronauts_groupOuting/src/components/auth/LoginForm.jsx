import React, { useState } from "react";
import {
	Box,
	Card,
	CardContent,
	TextField,
	Button,
	Typography,
	Alert,
	InputAdornment,
	IconButton,
	Link,
	Divider,
	CircularProgress,
} from "@mui/material";
import {
	Visibility,
	VisibilityOff,
	Email,
	Lock,
	Login as LoginIcon,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";

const LoginForm = ({ onSwitchToSignup, onClose }) => {
	const { signIn, loading } = useAuth();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [alert, setAlert] = useState({
		show: false,
		message: "",
		severity: "info",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Clear field error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		// Email validation
		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Please enter a valid email";
		}

		// Password validation
		if (!formData.password) {
			newErrors.password = "Password is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		try {
			const { data, error } = await signIn(formData.email, formData.password);

			if (error) {
				let errorMessage = "An error occurred during login";

				if (error.message.includes("Invalid login credentials")) {
					errorMessage = "Invalid email or password";
				} else if (error.message.includes("Email not confirmed")) {
					errorMessage = "Please confirm your email before logging in";
				} else if (error.message.includes("Too many requests")) {
					errorMessage = "Too many login attempts. Please try again later";
				}

				setAlert({
					show: true,
					message: errorMessage,
					severity: "error",
				});
				return;
			}

			if (data?.user) {
				setAlert({
					show: true,
					message: "Login successful! Welcome back.",
					severity: "success",
				});

				// Close the form after a short delay
				setTimeout(() => {
					onClose?.();
				}, 1500);
			}
		} catch (error) {
			console.error("Login error:", error);
			setAlert({
				show: true,
				message: "An unexpected error occurred. Please try again.",
				severity: "error",
			});
		}
	};

	const handleTogglePassword = () => {
		setShowPassword((prev) => !prev);
	};

	return (
		<Card sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
			<CardContent sx={{ p: 4 }}>
				<Box sx={{ textAlign: "center", mb: 3 }}>
					<LoginIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
					<Typography variant="h4" component="h1" gutterBottom>
						Welcome Back
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Sign in to your SyncroNauts account
					</Typography>
				</Box>

				{alert.show && (
					<Alert
						severity={alert.severity}
						sx={{ mb: 2 }}
						onClose={() => setAlert({ ...alert, show: false })}
					>
						{alert.message}
					</Alert>
				)}

				<Box component="form" onSubmit={handleSubmit} noValidate>
					<TextField
						fullWidth
						label="Email Address"
						name="email"
						type="email"
						value={formData.email}
						onChange={handleChange}
						error={!!errors.email}
						helperText={errors.email}
						margin="normal"
						required
						autoComplete="email"
						autoFocus
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Email color="action" />
								</InputAdornment>
							),
						}}
					/>

					<TextField
						fullWidth
						label="Password"
						name="password"
						type={showPassword ? "text" : "password"}
						value={formData.password}
						onChange={handleChange}
						error={!!errors.password}
						helperText={errors.password}
						margin="normal"
						required
						autoComplete="current-password"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Lock color="action" />
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleTogglePassword}
										edge="end"
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						size="large"
						disabled={loading}
						sx={{ mt: 3, mb: 2, py: 1.5 }}
						startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
					>
						{loading ? "Signing In..." : "Sign In"}
					</Button>

					<Box sx={{ textAlign: "center", mt: 2 }}>
						<Link
							component="button"
							type="button"
							variant="body2"
							onClick={() => {
								// TODO: Implement forgot password
								setAlert({
									show: true,
									message: "Forgot password feature coming soon!",
									severity: "info",
								});
							}}
							sx={{ textDecoration: "none" }}
						>
							Forgot your password?
						</Link>
					</Box>

					<Divider sx={{ my: 3 }}>
						<Typography variant="body2" color="text.secondary">
							OR
						</Typography>
					</Divider>

					<Box sx={{ textAlign: "center" }}>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
							Don't have an account?
						</Typography>
						<Button
							variant="outlined"
							onClick={onSwitchToSignup}
							disabled={loading}
							fullWidth
						>
							Create Account
						</Button>
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
};

export default LoginForm;
