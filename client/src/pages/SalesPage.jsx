import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { BadgeIndianRupee,  ShoppingCart, TrendingUp } from "lucide-react";
import SalesOverviewChart from "../components/sales/SalesOverviewChart";
import SalesByCategoryChart from "../components/sales/SalesByCategoryChart";
import DailySalesTrend from "../components/sales/DailySalesTrend";
import axios from "axios";
import { useContext } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../App";
import { formatMoney } from "../util/priceFormat";

const SalesPage = () => {
	const { userAuth: { token } } = useContext(UserContext);

	const [saleData, setSaleData] = useState({
	});

	useEffect(() => {
		const fetchSalesData = async () => {
			try {
				const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/projects/sales/overview`, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});
				if (response) {
					setSaleData(response.data.salesData[0]);
				}
			} catch (error) {
				toast.error("Failed to fetch sales data");
			}
		};

		fetchSalesData();
	}, [token]);

	console.log("salesData", saleData)

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Sales Dashboard' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
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
						value={formatMoney(saleData.totalRevenue)}
						color='#6366F1'
					/>
					<StatCard
						name='Avg. Order Value'
						icon={ShoppingCart}
						value={formatMoney(saleData.avgOrderValue)}
						color='#10B981'
					/>
					<StatCard
						name='Sales'
						icon={TrendingUp}
						value={(saleData.totalSales)}
						color='#F59E0B'
					/>
					
				</motion.div>

				<SalesOverviewChart />

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<SalesByCategoryChart />
					<DailySalesTrend />
				</div>
			</main>
		</div>
	);
};

export default SalesPage;
