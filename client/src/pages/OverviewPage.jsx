import { BarChart2, IndianRupee, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../App";
import { formatMoney } from "../util/priceFormat";
import toast from "react-hot-toast";

const OverviewPage = () => {
	const [totalSale, setTotalSales] = useState(0);
	const [totalEarnings, setTotalEarnings] = useState(0);
	const [totalProjects, setTotalProjects] = useState(0);

	const [CDtotalSale, setCDTotalSale] = useState(0);
	const [CDtotalEarninga, setCDTotalEarninga] = useState(0);



	let { userAuth, userAuth: { user } } = useContext(UserContext);

	const getTotalSales = async () => {
		const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/total-sales/${user.id}`, {
			headers: {
				Authorization: `Bearer ${userAuth.token}`
			}
		}).then(({ data }) => {
			setCDTotalSale(data.totalSales)
			const formattedPrice = formatMoney(data.totalSales)
			setTotalSales(formattedPrice);
		})
			.catch(({ response }) => {
				toast.error(response.data.message)
			})
	}

	const getTotalEarnings = async () => {
		const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/get-total-earnings`, {
			headers: {
				Authorization: `Bearer ${userAuth.token}`
			}
		}).then(({ data }) => {
			setCDTotalEarninga(data.totalEarning)
			const formattedPrice = formatMoney(data.totalEarning)
			setTotalEarnings(formattedPrice);
		})
			.catch(({ response }) => {
				toast.error(response.data.message)
			})
	}

	const getTotalProjects = async () => {
		const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/get-projects`, {
			headers: {
				Authorization: `Bearer ${userAuth.token}`
			}
		}).then(({ data }) => {
			setTotalProjects(data.count);
		})
			.catch(({ response }) => {
				toast.error(response.data.message)
			})
	}

	useEffect(() => {
		getTotalSales();
		getTotalEarnings();
		getTotalProjects();
	}, [userAuth])

	// Create dynamic category data

	const categoryData = [
		{ name: "Total Sales", value: CDtotalSale },
		{ name: "Total Earnings", value: CDtotalEarninga }
	];

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Overview' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Sales' icon={Zap} value={totalSale} color='#6366F1' />
					<StatCard name='Total Earnings' icon={IndianRupee} value={totalEarnings} color='#8B5CF6' />
					<StatCard name='Total Products' icon={ShoppingBag} value={totalProjects} color='#EC4899' />
				</motion.div>

				{/* CHARTS */}

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					<SalesOverviewChart />
					{(CDtotalSale && CDtotalEarninga) && <CategoryDistributionChart categoryData={categoryData} />}

					{/* <SalesChannelChart /> */}
				</div>
			</main>
		</div>
	);
};

export default OverviewPage;
