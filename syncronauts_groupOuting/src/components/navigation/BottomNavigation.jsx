import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	BottomNavigation as MuiBottomNavigation,
	BottomNavigationAction,
	Paper,
} from "@mui/material";
import {
	Home as HomeIcon,
	Chat as ChatIcon,
	Event as EventIcon,
	Person as PersonIcon,
	Groups as GroupChatIcon,
} from "@mui/icons-material";

const navigationItems = [
	{ label: "Home", icon: <HomeIcon />, path: "/" },
	{ label: "Chat", icon: <ChatIcon />, path: "/chat" },
	{ label: "Groups", icon: <GroupChatIcon />, path: "/group-chat" },
	{ label: "Events", icon: <EventIcon />, path: "/events" },
	{ label: "Profile", icon: <PersonIcon />, path: "/profile" },
];

const BottomNavigation = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const currentIndex = navigationItems.findIndex(
		(item) => item.path === location.pathname
	);

	const handleChange = (event, newValue) => {
		navigate(navigationItems[newValue].path);
	};

	return (
		<Paper
			sx={{
				position: "fixed",
				bottom: 0,
				left: 0,
				right: 0,
				zIndex: 1000,
				backgroundColor: "background.paper",
				backdropFilter: "blur(20px)",
				borderTop: "1px solid",
				borderColor: "divider",
				borderRadius: "20px 20px 0 0",
				pb: "env(safe-area-inset-bottom)",
				boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
			}}
			elevation={0}
		>
			<MuiBottomNavigation
				value={currentIndex}
				onChange={handleChange}
				showLabels
				sx={{
					backgroundColor: "transparent",
					height: "auto",
					py: 1,
					px: 0.5,
					"& .MuiBottomNavigationAction-root": {
						minWidth: "auto",
						maxWidth: "none",
						flex: 1,
						borderRadius: 2.5,
						mx: 0.25,
						py: 1.2,
						transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
						color: "text.secondary",
						"&.Mui-selected": {
							backgroundColor: "primary.main",
							color: "white",
							transform: "translateY(-3px)",
							boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
							"& .MuiBottomNavigationAction-label": {
								fontSize: "0.75rem",
								fontWeight: 700,
								color: "white",
								mt: 0.5,
								opacity: 1,
							},
							"& .MuiSvgIcon-root": {
								fontSize: "1.4rem",
								color: "white",
							},
						},
						"&:not(.Mui-selected)": {
							"& .MuiBottomNavigationAction-label": {
								fontSize: "0.7rem",
								fontWeight: 500,
								color: "text.secondary",
								mt: 0.5,
								opacity: 0.8,
							},
							"& .MuiSvgIcon-root": {
								fontSize: "1.2rem",
								color: "text.secondary",
								opacity: 0.7,
							},
							"&:hover": {
								backgroundColor: "action.hover",
								"& .MuiSvgIcon-root": {
									opacity: 1,
								},
								"& .MuiBottomNavigationAction-label": {
									opacity: 1,
								},
							},
						},
					},
				}}
			>
				{navigationItems.map((item) => (
					<BottomNavigationAction
						key={item.label}
						label={item.label}
						icon={item.icon}
					/>
				))}
			</MuiBottomNavigation>
		</Paper>
	);
};

export default BottomNavigation;
