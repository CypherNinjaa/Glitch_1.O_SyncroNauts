import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
	Box,
	Divider,
	IconButton,
	Switch,
	FormControlLabel,
	Chip,
	Tooltip,
} from "@mui/material";
import {
	Home as HomeIcon,
	Chat as ChatIcon,
	Event as EventIcon,
	Person as PersonIcon,
	AccountBalanceWallet as ExpenseIcon,
	Brightness4 as DarkModeIcon,
	Brightness7 as LightModeIcon,
	Dashboard as DashboardIcon,
	ChevronLeft as ChevronLeftIcon,
	ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

const drawerWidthExpanded = 280;
const drawerWidthCollapsed = 72;

const navigationItems = [
	{ label: "Dashboard", icon: <HomeIcon />, path: "/", badge: null },
	{ label: "Chat", icon: <ChatIcon />, path: "/chat", badge: "3" },
	{ label: "Events", icon: <EventIcon />, path: "/events", badge: null },
	{ label: "Expenses", icon: <ExpenseIcon />, path: "/expenses", badge: null },
	{ label: "Profile", icon: <PersonIcon />, path: "/profile", badge: null },
];

const Sidebar = ({ collapsed = true, onToggle }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { darkMode, toggleTheme } = useContext(ThemeContext);

	const handleItemClick = (path) => {
		navigate(path);
	};

	const handleToggleSidebar = () => {
		if (onToggle) {
			onToggle();
		}
	};

	return (
		<Drawer
			variant="permanent"
			sx={{
				width: collapsed ? drawerWidthCollapsed : drawerWidthExpanded,
				flexShrink: 0,
				transition: 'width 0.3s ease-in-out',
				"& .MuiDrawer-paper": {
					width: collapsed ? drawerWidthCollapsed : drawerWidthExpanded,
					boxSizing: "border-box",
					display: "flex",
					flexDirection: "column",
					bgcolor: 'background.paper',
					borderRight: '1px solid',
					borderColor: 'divider',
					transition: 'width 0.3s ease-in-out',
					overflowX: 'hidden',
				},
			}}
		>
			{/* Header Section */}
			<Box sx={{ p: collapsed ? 1.5 : 3, pb: collapsed ? 1.5 : 2 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: collapsed ? 0 : 1 }}>
					{collapsed ? (
						<Tooltip title="Dashboard" placement="right">
							<IconButton
								onClick={() => handleItemClick("/")}
								sx={{
									width: 40,
									height: 40,
									borderRadius: 2,
									bgcolor: location.pathname === "/" ? 'primary.main' : 'primary.main',
									color: 'white',
									'&:hover': {
										bgcolor: location.pathname === "/" ? 'primary.dark' : 'primary.dark',
									},
									transition: 'all 0.2s ease-in-out',
								}}
							>
								<DashboardIcon sx={{ fontSize: 24 }} />
							</IconButton>
						</Tooltip>
					) : (
						<>
							<IconButton
								onClick={() => handleItemClick("/")}
								sx={{
									width: 40,
									height: 40,
									borderRadius: 2,
									bgcolor: 'primary.main',
									color: 'white',
									'&:hover': {
										bgcolor: 'primary.dark',
									},
									transition: 'all 0.2s ease-in-out',
								}}
							>
								<DashboardIcon sx={{ fontSize: 24 }} />
							</IconButton>
							<Typography
								variant="h6"
								component="div"
								sx={{
									fontWeight: 700,
									color: "text.primary",
									cursor: 'pointer',
								}}
								onClick={() => handleItemClick("/")}
							>
								SyncroNauts
							</Typography>
						</>
					)}
				</Box>
				{!collapsed && (
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ fontWeight: 500, ml: 6.5 }}
					>
						Group Planning
					</Typography>
				)}
			</Box>
			
			{/* Toggle Button */}
			<Box sx={{ display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end', px: collapsed ? 1 : 2, pb: 1 }}>
				<IconButton
					onClick={handleToggleSidebar}
					sx={{
						p: 1,
						borderRadius: 1.5,
						bgcolor: 'action.hover',
						'&:hover': {
							bgcolor: 'action.selected',
						},
					}}
				>
					{collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
				</IconButton>
			</Box>
			
			<Divider sx={{ mx: collapsed ? 1 : 2, opacity: 0.3 }} />
			
			{/* Navigation */}
			<List sx={{ flexGrow: 1, px: collapsed ? 1 : 2, py: 2 }}>
				{navigationItems.map((item) => (
					<ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
						{collapsed ? (
							<Tooltip title={item.label} placement="right">
								<ListItemButton
									onClick={() => handleItemClick(item.path)}
									selected={location.pathname === item.path}
									sx={{
										borderRadius: 3,
										py: 1.5,
										px: 1.5,
										minHeight: 48,
										justifyContent: 'center',
										"&.Mui-selected": {
											backgroundColor: "primary.main",
											color: "white",
											"&:hover": {
												backgroundColor: "primary.dark",
											},
											"& .MuiListItemIcon-root": {
												color: "white",
											},
										},
										"&:hover": {
											backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
										},
										transition: "all 0.2s ease-in-out",
									}}
								>
									<ListItemIcon
										sx={{
											minWidth: 'auto',
											color: location.pathname === item.path ? "white" : "text.secondary",
											justifyContent: 'center',
										}}
									>
										{item.icon}
									</ListItemIcon>
								</ListItemButton>
							</Tooltip>
						) : (
							<ListItemButton
								onClick={() => handleItemClick(item.path)}
								selected={location.pathname === item.path}
								sx={{
									borderRadius: 3,
									py: 1.5,
									px: 2,
									minHeight: 48,
									"&.Mui-selected": {
										backgroundColor: "primary.main",
										color: "white",
										"&:hover": {
											backgroundColor: "primary.dark",
										},
										"& .MuiListItemIcon-root": {
											color: "white",
										},
										"& .MuiListItemText-primary": {
											color: "white",
										},
									},
									"&:hover": {
										backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
									},
									transition: "all 0.2s ease-in-out",
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: 40,
										color: location.pathname === item.path ? "white" : "text.secondary",
									}}
								>
									{item.icon}
								</ListItemIcon>
								<ListItemText
									primary={item.label}
									sx={{
										"& .MuiTypography-root": {
											fontWeight: location.pathname === item.path ? 600 : 500,
											fontSize: '0.9rem',
										},
									}}
								/>
								{item.badge && (
									<Chip
										size="small"
										label={item.badge}
										sx={{
											height: 20,
											fontSize: '0.75rem',
											bgcolor: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'primary.main',
											color: location.pathname === item.path ? 'white' : 'white',
										}}
									/>
								)}
							</ListItemButton>
						)}
					</ListItem>
				))}
			</List>
			
			<Divider sx={{ mx: collapsed ? 1 : 2, opacity: 0.3 }} />
			
			{/* Theme Toggle */}
			<Box sx={{ p: collapsed ? 1.5 : 3 }}>
				{collapsed ? (
					<Tooltip title={`${darkMode ? 'Light' : 'Dark'} Mode`} placement="right">
						<IconButton
							onClick={toggleTheme}
							sx={{
								width: '100%',
								p: 1.5,
								borderRadius: 2,
								backgroundColor: darkMode
									? "rgba(148, 163, 184, 0.1)"
									: "rgba(226, 232, 240, 0.5)",
								'&:hover': {
									backgroundColor: darkMode
										? "rgba(148, 163, 184, 0.2)"
										: "rgba(226, 232, 240, 0.8)",
								},
							}}
						>
							{darkMode ? (
								<DarkModeIcon sx={{ fontSize: 20 }} />
							) : (
								<LightModeIcon sx={{ fontSize: 20 }} />
							)}
						</IconButton>
					</Tooltip>
				) : (
					<FormControlLabel
						control={
							<Switch
								checked={darkMode}
								onChange={toggleTheme}
								sx={{
									"& .MuiSwitch-switchBase.Mui-checked": {
										color: "primary.main",
										"& + .MuiSwitch-track": {
											backgroundColor: "primary.main",
										},
									},
								}}
							/>
						}
						label={
							<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
								<Box
									sx={{
										p: 1,
										borderRadius: 2,
										backgroundColor: darkMode
											? "rgba(148, 163, 184, 0.1)"
											: "rgba(226, 232, 240, 0.5)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									{darkMode ? (
										<DarkModeIcon sx={{ fontSize: 18 }} />
									) : (
										<LightModeIcon sx={{ fontSize: 18 }} />
									)}
								</Box>
								<Typography variant="body2" sx={{ fontWeight: 500 }}>
									{darkMode ? "Dark" : "Light"} Mode
								</Typography>
							</Box>
						}
						sx={{ m: 0 }}
					/>
				)}
			</Box>
		</Drawer>
	);
};

export default Sidebar;
