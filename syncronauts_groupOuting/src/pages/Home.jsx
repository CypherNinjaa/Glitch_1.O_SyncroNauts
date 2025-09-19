import React from "react";
import {
	Typography,
	Box,
	Card,
	CardContent,
	Grid,
	Button,
	Paper,
	Chip,
	LinearProgress,
	useTheme,
	useMediaQuery,
	Avatar,
	Stack,
} from "@mui/material";
import {
	Group as GroupIcon,
	Event as EventIcon,
	AttachMoney as MoneyIcon,
	Chat as ChatIcon,
	TrendingUp as TrendingUpIcon,
	CalendarToday as CalendarIcon,
	Notifications as NotificationsIcon,
	Add as AddIcon,
} from "@mui/icons-material";

const Home = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const stats = [
		{ label: "Active Events", value: "3", change: "+2", color: "primary" },
		{ label: "Group Members", value: "12", change: "+3", color: "success" },
		{ label: "Total Expenses", value: "$2,450", change: "+$450", color: "warning" },
		{ label: "Messages", value: "48", change: "+12", color: "info" },
	];

	const recentActivity = [
		{ action: "New event created", user: "John Doe", time: "2 hours ago", avatar: "J" },
		{ action: "Expense added", user: "Jane Smith", time: "4 hours ago", avatar: "JS" },
		{ action: "Message sent", user: "Mike Wilson", time: "6 hours ago", avatar: "M" },
	];

	return (
		<Box sx={{ maxWidth: 1200, mx: 'auto' }}>
			{/* Header */}
			<Box sx={{ mb: 4 }}>
				<Typography 
					variant="h4" 
					component="h1" 
					sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}
				>
					Dashboard
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Welcome back! Here's what's happening with your group
				</Typography>
			</Box>

			{/* Stats Grid */}
			<Grid container spacing={isMobile ? 2 : 3} sx={{ mb: 4 }}>
				{stats.map((stat, index) => (
					<Grid item xs={6} sm={6} md={3} key={index}>
						<Card 
							sx={{ 
								p: isMobile ? 2 : 3,
								height: '100%',
								background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
								backdropFilter: 'blur(10px)',
								border: '1px solid',
								borderColor: 'divider',
								borderRadius: isMobile ? 2 : 3,
							}}
						>
							<Box sx={{ 
								display: 'flex', 
								flexDirection: isMobile ? 'column' : 'row',
								justifyContent: 'space-between', 
								alignItems: isMobile ? 'flex-start' : 'flex-start',
								gap: isMobile ? 1 : 0
							}}>
								<Box sx={{ flex: 1 }}>
									<Typography 
										variant={isMobile ? "caption" : "body2"} 
										color="text.secondary" 
										sx={{ mb: isMobile ? 0.5 : 1, fontSize: isMobile ? '0.7rem' : '0.875rem' }}
									>
										{stat.label}
									</Typography>
									<Typography 
										variant={isMobile ? "h5" : "h4"} 
										sx={{ fontWeight: 700, mb: isMobile ? 0.5 : 1 }}
									>
										{stat.value}
									</Typography>
									<Chip 
										label={stat.change}
										size="small"
										color={stat.color}
										sx={{ fontSize: isMobile ? '0.65rem' : '0.75rem', height: isMobile ? 18 : 24 }}
									/>
								</Box>
								{!isMobile && (
									<TrendingUpIcon color={stat.color} sx={{ fontSize: 32 }} />
								)}
							</Box>
						</Card>
					</Grid>
				))}
			</Grid>

			<Grid container spacing={3}>
				{/* Main Content Cards */}
				<Grid item xs={12} md={8}>
					<Stack spacing={isMobile ? 2 : 3}>
						{/* Quick Actions */}
						<Card sx={{ p: isMobile ? 2 : 3, borderRadius: isMobile ? 2 : 3 }}>
							<Typography variant="h6" sx={{ fontWeight: 600, mb: isMobile ? 2 : 3, fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
								Quick Actions
							</Typography>
							<Grid container spacing={isMobile ? 1.5 : 2}>
								<Grid item xs={6} sm={6}>
									<Button
										variant="contained"
										fullWidth
										startIcon={<AddIcon />}
										sx={{ 
											py: isMobile ? 1.2 : 1.5, 
											borderRadius: 2,
											textTransform: 'none',
											fontWeight: 600,
											fontSize: isMobile ? '0.8rem' : '0.875rem'
										}}
									>
										{isMobile ? 'New Event' : 'Create New Event'}
									</Button>
								</Grid>
								<Grid item xs={6} sm={6}>
									<Button
										variant="outlined"
										fullWidth
										startIcon={<GroupIcon />}
										sx={{ 
											py: isMobile ? 1.2 : 1.5, 
											borderRadius: 2,
											textTransform: 'none',
											fontWeight: 600,
											fontSize: isMobile ? '0.8rem' : '0.875rem'
										}}
									>
										{isMobile ? 'Invite' : 'Invite Members'}
									</Button>
								</Grid>
								<Grid item xs={6} sm={6}>
									<Button
										variant="outlined"
										fullWidth
										startIcon={<MoneyIcon />}
										sx={{ 
											py: isMobile ? 1.2 : 1.5, 
											borderRadius: 2,
											textTransform: 'none',
											fontWeight: 600,
											fontSize: isMobile ? '0.8rem' : '0.875rem'
										}}
									>
										{isMobile ? 'Expense' : 'Add Expense'}
									</Button>
								</Grid>
								<Grid item xs={6} sm={6}>
									<Button
										variant="outlined"
										fullWidth
										startIcon={<ChatIcon />}
										sx={{ 
											py: isMobile ? 1.2 : 1.5, 
											borderRadius: 2,
											textTransform: 'none',
											fontWeight: 600,
											fontSize: isMobile ? '0.8rem' : '0.875rem'
										}}
									>
										{isMobile ? 'Chat' : 'Open Chat'}
									</Button>
								</Grid>
							</Grid>
						</Card>

						{/* Upcoming Events */}
						<Card sx={{ p: isMobile ? 2 : 3, borderRadius: isMobile ? 2 : 3 }}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: isMobile ? 2 : 3 }}>
								<Typography variant="h6" sx={{ fontWeight: 600, fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
									Upcoming Events
								</Typography>
								<CalendarIcon color="primary" />
							</Box>
							<Box sx={{ mb: isMobile ? 2 : 3 }}>
								<Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
									Next Event Progress
								</Typography>
								<LinearProgress 
									variant="determinate" 
									value={75} 
									sx={{ 
										height: isMobile ? 6 : 8, 
										borderRadius: 4,
										bgcolor: 'grey.200',
										'& .MuiLinearProgress-bar': {
											borderRadius: 4,
										}
									}}
								/>
								<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontSize: isMobile ? '0.7rem' : '0.75rem' }}>
									3 of 4 tasks completed
								</Typography>
							</Box>
							<Box sx={{ p: isMobile ? 1.5 : 2, bgcolor: 'action.hover', borderRadius: 2 }}>
								<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, fontSize: isMobile ? '0.95rem' : '1rem' }}>
									Weekend Hiking Trip
								</Typography>
								<Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
									June 15-16, 2024 • Mount Wilson Trail
								</Typography>
							</Box>
						</Card>
					</Stack>
				</Grid>

				{/* Sidebar */}
				<Grid item xs={12} md={4}>
					<Stack spacing={isMobile ? 2 : 3}>
						{/* Recent Activity */}
						<Card sx={{ p: isMobile ? 2 : 3, borderRadius: isMobile ? 2 : 3 }}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: isMobile ? 2 : 3 }}>
								<Typography variant="h6" sx={{ fontWeight: 600, fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
									Recent Activity
								</Typography>
								<NotificationsIcon color="primary" />
							</Box>
							<Stack spacing={isMobile ? 1.5 : 2}>
								{recentActivity.map((activity, index) => (
									<Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1.5 : 2 }}>
										<Avatar 
											sx={{ 
												width: isMobile ? 28 : 32, 
												height: isMobile ? 28 : 32, 
												fontSize: isMobile ? '0.75rem' : '0.875rem',
												bgcolor: 'primary.main'
											}}
										>
											{activity.avatar}
										</Avatar>
										<Box sx={{ flex: 1, minWidth: 0 }}>
											<Typography variant="body2" sx={{ fontWeight: 500, fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
												{activity.action}
											</Typography>
											<Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}>
												by {activity.user} • {activity.time}
											</Typography>
										</Box>
									</Box>
								))}
							</Stack>
						</Card>

						{/* Group Summary */}
						<Card sx={{ p: isMobile ? 2 : 3, borderRadius: isMobile ? 2 : 3 }}>
							<Typography variant="h6" sx={{ fontWeight: 600, mb: isMobile ? 2 : 3, fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
								Group Summary
							</Typography>
							<Stack spacing={isMobile ? 1.5 : 2}>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
										Total Members
									</Typography>
									<Typography variant="body2" sx={{ fontWeight: 600, fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
										12
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
										Active Events
									</Typography>
									<Typography variant="body2" sx={{ fontWeight: 600, fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
										3
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
										Pending Expenses
									</Typography>
									<Typography variant="body2" sx={{ fontWeight: 600, fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
										$450
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
										Unread Messages
									</Typography>
									<Chip 
										label="5"
										size="small"
										color="primary"
										sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', minWidth: 'auto', height: isMobile ? 18 : 20 }}
									/>
								</Box>
							</Stack>
						</Card>
					</Stack>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Home;
