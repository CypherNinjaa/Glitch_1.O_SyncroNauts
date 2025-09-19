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
	FormControlLabel,
	Checkbox,
} from "@mui/material";
import {
	Visibility,
	VisibilityOff,
	Email,
	Lock,
	Person,
	PersonAdd as SignupIcon,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";

const SignupForm = ({ onSwitchToLogin, onClose }) => {
	const { signUp, loading } = useAuth();
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
		agreeToTerms: false,
	});
	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [alert, setAlert] = useState({
		show: false,
		message: "",
		severity: "info",
	});

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
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

		// Full name validation
		if (!formData.fullName.trim()) {
			newErrors.fullName = "Full name is required";
		} else if (formData.fullName.trim().length < 2) {
			newErrors.fullName = "Full name must be at least 2 characters";
		}

		// Email validation
		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Please enter a valid email";
		}

		// Password validation
		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		} else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
			newErrors.password =
				"Password must contain at least one uppercase letter, one lowercase letter, and one number";
		}

		// Confirm password validation
		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		// Terms agreement validation
		if (!formData.agreeToTerms) {
			newErrors.agreeToTerms = "You must agree to the terms and conditions";
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
			const { data, error, message } = await signUp(
				formData.email,
				formData.password,
				{
					full_name: formData.fullName.trim(),
				}
			);

			if (error) {
				let errorMessage = "An error occurred during registration";

				if (error.message.includes("already registered")) {
					errorMessage = "An account with this email already exists";
				} else if (error.message.includes("Password should be")) {
					errorMessage = "Password does not meet security requirements";
				} else if (error.message.includes("Invalid email")) {
					errorMessage = "Please enter a valid email address";
				}

				setAlert({
					show: true,
					message: errorMessage,
					severity: "error",
				});
				return;
			}

			if (message) {
				// User needs to confirm email
				setAlert({
					show: true,
					message: message,
					severity: "info",
				});
			} else if (data?.user) {
				// User was created and confirmed immediately
				setAlert({
					show: true,
					message: "Account created successfully! Welcome to SyncroNauts.",
					severity: "success",
				});

				// Close the form after a short delay
				setTimeout(() => {
					onClose?.();
				}, 2000);
			}
		} catch (error) {
			console.error("Signup error:", error);
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

	const handleToggleConfirmPassword = () => {
		setShowConfirmPassword((prev) => !prev);
	};

	return (
		<Card sx={{ maxWidth: 450, mx: "auto", mt: 4 }}>
			<CardContent sx={{ p: 4 }}>
				<Box sx={{ textAlign: "center", mb: 3 }}>
					<SignupIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
					<Typography variant="h4" component="h1" gutterBottom>
						Join SyncroNauts
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Create your account to start your group outing adventure
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
						label="Full Name"
						name="fullName"
						value={formData.fullName}
						onChange={handleChange}
						error={!!errors.fullName}
						helperText={errors.fullName}
						margin="normal"
						required
						autoComplete="name"
						autoFocus
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Person color="action" />
								</InputAdornment>
							),
						}}
					/>

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
						autoComplete="new-password"
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

					<TextField
						fullWidth
						label="Confirm Password"
						name="confirmPassword"
						type={showConfirmPassword ? "text" : "password"}
						value={formData.confirmPassword}
						onChange={handleChange}
						error={!!errors.confirmPassword}
						helperText={errors.confirmPassword}
						margin="normal"
						required
						autoComplete="new-password"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Lock color="action" />
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle confirm password visibility"
										onClick={handleToggleConfirmPassword}
										edge="end"
									>
										{showConfirmPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>

					<FormControlLabel
						control={
							<Checkbox
								name="agreeToTerms"
								checked={formData.agreeToTerms}
								onChange={handleChange}
								color="primary"
							/>
						}
						label={
							<Typography variant="body2">
								I agree to the{" "}
								<Link
									component="button"
									type="button"
									onClick={(e) => {
										e.preventDefault();
										// TODO: Open terms and conditions
										setAlert({
											show: true,
											message: "Terms and conditions coming soon!",
											severity: "info",
										});
									}}
									sx={{ textDecoration: "none" }}
								>
									Terms and Conditions
								</Link>{" "}
								and{" "}
								<Link
									component="button"
									type="button"
									onClick={(e) => {
										e.preventDefault();
										// TODO: Open privacy policy
										setAlert({
											show: true,
											message: "Privacy policy coming soon!",
											severity: "info",
										});
									}}
									sx={{ textDecoration: "none" }}
								>
									Privacy Policy
								</Link>
							</Typography>
						}
						sx={{ mt: 1 }}
					/>
					{errors.agreeToTerms && (
						<Typography
							variant="caption"
							color="error"
							sx={{ display: "block", mt: 0.5 }}
						>
							{errors.agreeToTerms}
						</Typography>
					)}

					<Button
						type="submit"
						fullWidth
						variant="contained"
						size="large"
						disabled={loading}
						sx={{ mt: 3, mb: 2, py: 1.5 }}
						startIcon={
							loading ? <CircularProgress size={20} /> : <SignupIcon />
						}
					>
						{loading ? "Creating Account..." : "Create Account"}
					</Button>

					<Divider sx={{ my: 3 }}>
						<Typography variant="body2" color="text.secondary">
							OR
						</Typography>
					</Divider>

					<Box sx={{ textAlign: "center" }}>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
							Already have an account?
						</Typography>
						<Button
							variant="outlined"
							onClick={onSwitchToLogin}
							disabled={loading}
							fullWidth
						>
							Sign In
						</Button>
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
};

export default SignupForm;
