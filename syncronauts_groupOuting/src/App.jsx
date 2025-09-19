import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Box } from "@mui/material";
import ThemeProvider from "./contexts/ThemeContext";
import MainLayout from "./layout/MainLayout";

// Main App Content Component
const AppContent = () => {
	// Go directly to dashboard - no authentication needed
	return (
		<Box sx={{ flexGrow: 1 }}>
			<MainLayout />
		</Box>
	);
};

function App() {
	return (
		<ThemeProvider>
			<Router>
				<AppContent />
			</Router>
		</ThemeProvider>
	);
}

export default App;
