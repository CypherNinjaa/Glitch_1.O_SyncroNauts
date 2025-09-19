import React from "react";import React from "react";

import { Typography, Box } from "@mui/material";import { Typography, Box } from "@mui/material";



const Home = () => {const Home = () => {

	return (	return (

		<Box sx={{ p: 4 }}>		<Box sx={{ p: 4 }}>

			<Typography variant="h3" gutterBottom>			<Typography variant="h3" gutterBottom>

				🎉 SyncroNauts Dashboard				🎉 SyncroNauts Dashboard

			</Typography>			</Typography>

			<Typography variant="h6" color="text.secondary">			<Typography variant="h6" color="text.secondary">

				Welcome to your group outing planner!				Welcome to your group outing planner!

			</Typography>			</Typography>

			<Typography variant="body1" sx={{ mt: 2 }}>			<Typography variant="body1" sx={{ mt: 2 }}>

				Navigate to the Chat section to start chatting with your group.				Navigate to the Chat section to start chatting with your group.

			</Typography>			</Typography>

		</Box>		</Box>

	);	);

};};



export default Home;export default Home;