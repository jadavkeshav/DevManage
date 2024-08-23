import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/common/Header';
import StatCard from '../components/common/StatCard';
import { AlertTriangle, CirclePlusIcon, DollarSign, Package, TrendingUp } from 'lucide-react'; // Import PlusCircle for the button
import CategoryDistributionChart from '../components/overview/CategoryDistributionChart';
import SalesTrendChart from '../components/products/SalesTrendChart';
import ProductsTable from '../components/products/ProductsTable';
import AddProductModal from '../components/products/AddProductModal'; // Import the modal
import { Button } from '@mui/material';

const ProductsPage = () => {
	const [modalOpen, setModalOpen] = useState(false);

	const handleOpenModal = () => setModalOpen(true);
	const handleCloseModal = () => setModalOpen(false);

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
						<CirclePlusIcon className='mr-1 px-0.5'/>
						Add New Project/Product
					</Button>
				</motion.div>
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Products' icon={Package} value={1234} color='#6366F1' />
					<StatCard name='Total Revenue' icon={DollarSign} value={"$543,210"} color='#EF4444' />
				</motion.div>



				<ProductsTable />

				{/* CHARTS */}
				<div className='grid grid-col-1 lg:grid-cols-2 gap-8'>
					<SalesTrendChart />
					<CategoryDistributionChart />
				</div>

				{/* Add Product Modal */}
				<AddProductModal open={modalOpen} onClose={handleCloseModal} />
			</main>
		</div>
	);
};

export default ProductsPage;
