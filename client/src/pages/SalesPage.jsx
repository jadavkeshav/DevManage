import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { BadgeIndianRupee, ShoppingCart, TrendingUp } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../App";
import { formatMoney } from "../util/priceFormat";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import DailySalesTrend from "../components/sales/DailySalesTrend"
import SalesByCategoryChart from "../components/sales/SalesByCategoryChart"
import { CircularProgress } from "@mui/material";

const SalesPage = () => {
	const { userAuth: { token } } = useContext(UserContext);
	const [loading, setLoading] = useState(true);
	const [saleData, setSaleData] = useState({});
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchSalesData = async () => {
			try {
				toast.loading("Loading sales data...");
				const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/projects/sales/overview`, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});
				setSaleData(response.data.salesData[0] || {});
				setLoading(false);
				toast.dismiss();
			} catch (error) {
				setError("Failed to fetch sales data.");
				setLoading(false);
				toast.dismiss();
				toast.error("Failed to fetch sales data");
			}
		};

		fetchSalesData();
	}, [token]);

	if (loading) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100%',
					width: '100%',
				}}
			>
				<CircularProgress />
			</div>
		);
	}

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Sales Dashboard' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{error ? (
					<div className='text-red-500 text-center'>{error}</div>
				) : (
					<>
						{/* SALES STATS */}
						<motion.div
							className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1 }}
						>
							<StatCard
								name='Total Revenue'
								icon={BadgeIndianRupee}
								value={formatMoney(saleData?.totalRevenue)}
								color='#6366F1'
							/>
							<StatCard
								name='Avg. Order Value'
								icon={ShoppingCart}
								value={formatMoney(saleData?.avgOrderValue)}
								color='#10B981'
							/>
							<StatCard
								name='Sales'
								icon={TrendingUp}
								value={saleData?.totalSales || 0}
								color='#F59E0B'
							/>
						</motion.div>

						{/* CHARTS */}
						<div className='mb-8'>
							{/* Assuming you have these components */}
							<SalesOverviewChart data={saleData?.overviewData} />
							<SalesByCategoryChart data={saleData?.categoryData} />
							<DailySalesTrend data={saleData?.dailyTrend} />
						</div>
					</>
				)}
			</main>
		</div>
	);
};

export default SalesPage;
