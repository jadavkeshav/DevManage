import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/team/UsersTable";
import UserGrowthChart from "../components/team/UserGrowthChart";
import UserActivityHeatmap from "../components/team/UserActivityHeatmap";
import UserDemographicsChart from "../components/team/UserDemographicsChart";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../App";
import toast from "react-hot-toast";


const DevelopersPage = () => {
    const { userAuth: { token } } = useContext(UserContext);
    const [userData, setUserData] = useState([]); // Initialize as an empty array
	const [totalUsers, setTotalUsers] = useState(0);

    const getAllDevelopers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/get-all-developers`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
			setTotalUsers(response.data.count)
            setUserData(response.data.users); // Ensure it's an array
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    useEffect(() => {
        getAllDevelopers();
    }, [token]); // Depend on `token` to refetch if it changes


    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Developers' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard
                        name='Total Developers'
                        icon={UsersIcon}
                        value={totalUsers}
                        color='#6366F1'
                    />
                </motion.div>

                {userData && <UsersTable userData={userData} />}
                {/* USER CHARTS */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
                    <UserGrowthChart />
                    <UserActivityHeatmap />
                    <UserDemographicsChart />
                </div>
            </main>
        </div>
    );
};

export default DevelopersPage;
