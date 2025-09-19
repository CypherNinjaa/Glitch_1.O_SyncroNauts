import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

const ThemeToggle = ({ sx = {} }) => {
	const { darkMode, toggleTheme } = useContext(ThemeContext);

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
