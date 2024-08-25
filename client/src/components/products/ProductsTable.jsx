import { motion } from 'framer-motion';
import { Edit, Search, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductsTable = ({ PRODUCT_DATA }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(PRODUCT_DATA);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        console.log('PRODUCT_DATA:', PRODUCT_DATA); // Debug: Check if data is passed correctly
        setFilteredProducts(PRODUCT_DATA);
    }, [PRODUCT_DATA]);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = PRODUCT_DATA.filter(
            (product) =>
                product.projectName.toLowerCase().includes(term) ||
                product.projectDesc.toLowerCase().includes(term)
        );
        setFilteredProducts(filtered);
    };

    const handleEdit = (productId) => {
        navigate(`/projects/${productId}`); // Navigate to ProjectPage with the product ID
    };

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold text-gray-100'>Product List</h2>
                <div className='relative'>
                    <input
                        type='text'
                        placeholder='Search products...'
                        className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={handleSearch}
                        value={searchTerm}
                    />
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                </div>
            </div>

            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                Name
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                Category
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                Price
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                Stock
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                Sales
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className='divide-y divide-gray-700'>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <motion.tr
                                    key={product._id} // Use _id from the response for key
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center'>
                                        <img
                                            src='https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww'
                                            alt='Product img'
                                            className='size-10 rounded-full'
                                        />
                                        {product.projectName}
                                    </td>
                                    <td className='relative px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                        <div className='truncated-text'>
                                            {product.projectDesc}
                                            <div className='tooltip'>{product.projectDesc}</div>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                        ${product.price?.toFixed(2)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.stock}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.sales}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                        <button
                                            className='text-indigo-400 hover:text-indigo-300 mr-2'
                                            onClick={() => handleEdit(product._id)} // Pass product ID to handleEdit
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button className='text-red-400 hover:text-red-300'>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan='6' className='px-6 py-4 text-center text-gray-300'>
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default ProductsTable;
