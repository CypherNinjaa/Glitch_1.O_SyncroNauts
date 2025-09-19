import React, { createContext, useState, useEffect } from "react";
import {
	createTheme,
	ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const ThemeContext = createContext({
	darkMode: false,
	toggleTheme: () => {},
});

// Define color palettes
const lightPalette = {
	primary: {
		main: "#6366f1",
		light: "#8b5cf6",
		dark: "#4f46e5",
		contrastText: "#ffffff",
	},
	secondary: {
		main: "#6b7280",
		light: "#9ca3af",
		dark: "#4b5563",
		contrastText: "#ffffff",
	},
	success: {
		main: "#10b981",
		light: "#34d399",
		dark: "#059669",
	},
	warning: {
		main: "#f59e0b",
		light: "#fbbf24",
		dark: "#d97706",
	},
	error: {
		main: "#ef4444",
		light: "#f87171",
		dark: "#dc2626",
	},
	background: {
		default: "#f8fafc",
		paper: "#ffffff",
	},
	text: {
		primary: "#0f172a",
		secondary: "#64748b",
	},
	divider: "#cbd5e1",
	grey: {
		50: "#f8fafc",
		100: "#f1f5f9",
		200: "#e2e8f0",
		300: "#cbd5e1",
		400: "#94a3b8",
		500: "#64748b",
		600: "#475569",
		700: "#334155",
		800: "#1e293b",
		900: "#0f172a",
	},
};

const darkPalette = {
	primary: {
		main: "#6366f1",
		light: "#8b5cf6",
		dark: "#4f46e5",
		contrastText: "#ffffff",
	},
	secondary: {
		main: "#6b7280",
		light: "#9ca3af",
		dark: "#4b5563",
		contrastText: "#ffffff",
	},
	success: {
		main: "#10b981",
		light: "#34d399",
		dark: "#059669",
	},
	warning: {
		main: "#f59e0b",
		light: "#fbbf24",
		dark: "#d97706",
	},
	error: {
		main: "#ef4444",
		light: "#f87171",
		dark: "#dc2626",
	},
	background: {
		default: "#0f172a",
		paper: "#1e293b",
	},
	text: {
		primary: "#f1f5f9",
		secondary: "#94a3b8",
	},
	divider: "#334155",
	grey: {
		50: "#f8fafc",
		100: "#f1f5f9",
		200: "#e2e8f0",
		300: "#cbd5e1",
		400: "#94a3b8",
		500: "#64748b",
		600: "#475569",
		700: "#334155",
		800: "#1e293b",
		900: "#0f172a",
	},
};

// Create theme function
const createAppTheme = (darkMode) => {
	return createTheme({
		palette: {
			mode: darkMode ? "dark" : "light",
			...(darkMode ? darkPalette : lightPalette),
		},
		typography: {
			fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
			h1: {
				fontSize: "2.5rem",
				fontWeight: 600,
				lineHeight: 1.2,
			},
			h2: {
				fontSize: "2rem",
				fontWeight: 600,
				lineHeight: 1.3,
			},
			h3: {
				fontSize: "1.75rem",
				fontWeight: 600,
				lineHeight: 1.4,
			},
			h4: {
				fontSize: "1.5rem",
				fontWeight: 600,
				lineHeight: 1.4,
			},
			h5: {
				fontSize: "1.25rem",
				fontWeight: 600,
				lineHeight: 1.5,
			},
			h6: {
				fontSize: "1.1rem",
				fontWeight: 600,
				lineHeight: 1.6,
			},
			button: {
				textTransform: "none",
				fontWeight: 500,
			},
		},
		shape: {
			borderRadius: 8,
		},
		components: {
			MuiButton: {
				styleOverrides: {
					root: {
						borderRadius: 8,
						padding: "8px 16px",
						fontWeight: 500,
					},
					contained: {
						boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
						"&:hover": {
							boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
						},
					},
				},
			},
			MuiCard: {
				styleOverrides: {
					root: {
						borderRadius: 12,
						boxShadow: darkMode
							? "0 4px 20px rgba(0,0,0,0.3)"
							: "0 2px 12px rgba(0,0,0,0.08)",
					},
				},
			},
			MuiTextField: {
				styleOverrides: {
					root: {
						"& .MuiOutlinedInput-root": {
							borderRadius: 8,
						},
					},
				},
			},
			MuiPaper: {
				styleOverrides: {
					root: {
						borderRadius: 12,
					},
				},
			},
			MuiAppBar: {
				styleOverrides: {
					root: {
						boxShadow: darkMode
							? "0 2px 8px rgba(0,0,0,0.3)"
							: "0 2px 8px rgba(0,0,0,0.1)",
					},
				},
			},
		},
	});
};

export const ThemeProvider = ({ children }) => {
	const [darkMode, setDarkMode] = useState(() => {
		// Get initial theme from localStorage or system preference
		const savedTheme = localStorage.getItem("syncronauts-theme");
		if (savedTheme) {
			return savedTheme === "dark";
		}
		// Default to dark mode
		return true;
	});

	const theme = createAppTheme(darkMode);

	const toggleTheme = () => {
		const newDarkMode = !darkMode;
		setDarkMode(newDarkMode);
		localStorage.setItem("syncronauts-theme", newDarkMode ? "dark" : "light");
	};

	// Listen for system theme changes
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = (e) => {
			// Only update if user hasn't manually set a preference
			const savedTheme = localStorage.getItem("syncronauts-theme");
			if (!savedTheme) {
				setDarkMode(e.matches);
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	const value = {
		darkMode,
		toggleTheme,
	};

	return (
		<ThemeContext.Provider value={value}>
			<MuiThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</MuiThemeProvider>
		</ThemeContext.Provider>
	);
};

export default ThemeProvider;
export { ThemeContext };
