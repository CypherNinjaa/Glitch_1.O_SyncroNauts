import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useTheme } from "../../hooks/useTheme";

const ThemeToggle = ({ sx = {} }) => {
	const { darkMode, toggleTheme } = useTheme();

	return (
		<Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
			<IconButton
				onClick={toggleTheme}
				color="inherit"
				sx={{
					...sx,
				}}
			>
				{darkMode ? <LightMode /> : <DarkMode />}
			</IconButton>
		</Tooltip>
	);
};

export default ThemeToggle;
