import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from "recharts";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../App";

const SalesOverviewChart = () => {
	const [data, setData] = useState([]);
	const { userAuth } = useContext(UserContext);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/get-projects-by-month`, {
					headers: {
						Authorization: `Bearer ${userAuth.token}`
					}
				});
				setData(response.data);
			} catch (error) {
				console.error("Error fetching project data:", error);
			}
		};

		fetchData();
	}, [userAuth]);

	// Ensure data includes a starting point (0,0) for proper chart display
	const processedData = [
		{ name: 'Jan', projects: 0 },
		...data,
		{ name: 'Dec', projects: 0 }
	];

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-100'>Projects Overview</h2>
			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<LineChart 
						data={processedData} 
						margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
					>
						<CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
						<XAxis 
							dataKey='name' 
							stroke='#9ca3af' 
							tick={{ fontSize: 12 }}
							tickFormatter={(tick) => tick}
						/>
						<YAxis 
							stroke='#9ca3af' 
							tick={{ fontSize: 12 }}
							domain={[0, 'auto']} // Start from 0
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
								borderRadius: "4px"
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Line
							type='monotone'
							dataKey='projects'
							stroke='url(#gradientProjects)'
							strokeWidth={3}
							dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
							activeDot={{ r: 8, strokeWidth: 2 }}
						/>
						<defs>
							<linearGradient id="gradientProjects" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
								<stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
							</linearGradient>
						</defs>
						<Brush dataKey='name' height={30} stroke="#6366F1" />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default SalesOverviewChart;
