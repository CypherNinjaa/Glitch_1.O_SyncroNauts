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
		main: "#1976d2",
		light: "#42a5f5",
		dark: "#1565c0",
		contrastText: "#ffffff",
	},
	secondary: {
		main: "#dc004e",
		light: "#ff5983",
		dark: "#9a0036",
		contrastText: "#ffffff",
	},
	background: {
		default: "#f5f5f5",
		paper: "#ffffff",
	},
	text: {
		primary: "#212121",
		secondary: "#757575",
	},
};

const darkPalette = {
	primary: {
		main: "#90caf9",
		light: "#e3f2fd",
		dark: "#42a5f5",
		contrastText: "#000000",
	},
	secondary: {
		main: "#f48fb1",
		light: "#ffc1e3",
		dark: "#bf5f82",
		contrastText: "#000000",
	},
	background: {
		default: "#121212",
		paper: "#1e1e1e",
	},
	text: {
		primary: "#ffffff",
		secondary: "#aaaaaa",
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
		// Default to system preference
		return window.matchMedia("(prefers-color-scheme: dark)").matches;
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
