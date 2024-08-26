import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/common/Header';
import StatCard from '../components/common/StatCard';
import { CirclePlusIcon, IndianRupeeIcon, Package } from 'lucide-react';
import ProductsTable from '../components/products/ProductsTable';
import AddProductModal from '../components/products/AddProductModal';
import { Button } from '@mui/material';
import { UserContext } from '../App';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatMoney } from '../util/priceFormat';
import WarningModal from '../components/common/WarningModal'; // Import WarningModal

const ProductsPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [warningModalOpen, setWarningModalOpen] = useState(false); // State to handle warning modal
    const [PRODUCT_DATA, SETPRODUCT_DATA] = useState([]);
    const [NumberOfProducts, SETNumberOfProducts] = useState(0);
    const [totalSale, setTotalSales] = useState(0);
    const [projectToDelete, setProjectToDelete] = useState(null); // Track which project to delete

    const { userAuth, userAuth: { user } } = useContext(UserContext);

    const getAllProjects = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/get-projects`, {
                headers: {
                    Authorization: `Bearer ${userAuth.token}`
                }
            });
            SETPRODUCT_DATA(response.data.projects);
            SETNumberOfProducts(response.data.count);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const getTotalSales = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/total-sales/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${userAuth.token}`
                }
            });
            const formattedPrice = formatMoney(response.data.totalRevenue);
            setTotalSales(formattedPrice);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        getTotalSales();
        getAllProjects();
    }, [userAuth]);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => {
		getTotalSales();
        getAllProjects();
		setModalOpen(false);
	}

    const handleDeleteProject = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/projects/${projectToDelete}`, {
                headers: {
                    Authorization: `Bearer ${userAuth.token}`
                }
            });
            toast.success('Project deleted successfully');
            getAllProjects();
			getTotalSales();
            setWarningModalOpen(false); // Close the warning modal
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const openWarningModal = (projectId) => {
        setProjectToDelete(projectId);
        setWarningModalOpen(true);
    };

    const closeWarningModal = () => {
        setProjectToDelete(null);
        setWarningModalOpen(false);
    };

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Products' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <motion.div
                    className=''
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={handleOpenModal}
                        sx={{ mb: 4 }}
                    >
                        <CirclePlusIcon className='mr-1 px-0.5' />
                        Add New Project/Product
                    </Button>
                </motion.div>
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard name='Total Products' icon={Package} value={NumberOfProducts} color='#6366F1' />
                    <StatCard name='Total Revenue' icon={IndianRupeeIcon} value={totalSale} color='#EF4444' />
                </motion.div>

                <ProductsTable PRODUCT_DATA={PRODUCT_DATA} onDelete={openWarningModal} />

                <AddProductModal open={modalOpen} onClose={handleCloseModal} />

                {/* Warning Modal */}
                <WarningModal
                    open={warningModalOpen}
                    onClose={closeWarningModal}
                    onConfirm={handleDeleteProject}
                    message={"Do you really want to delete this project? This action cannot be undone."}
                />
            </main>
        </div>
    );
};

export default ProductsPage;
