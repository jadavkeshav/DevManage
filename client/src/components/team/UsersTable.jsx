import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../../App";
import WarningModal from "../common/WarningModal";

const UsersTable = ({ userData, getAllDevelopers }) => {
    const { userAuth } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        if (userData.length > 0) {
            const filtered = userData.filter(
                (user) =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers([]);
        }
    }, [userData, searchTerm]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const confirmDeleteUser = (userId) => {
        setUserToDelete(userId);
        setIsModalOpen(true);
    };

    const handleDeleteUser = async () => {
        try {
            toast.loading("Deleting user...");
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/users/${userToDelete}`, {
                headers: {
                    Authorization: `Bearer ${userAuth.token}`
                }
            });
            toast.dismiss();
            toast.success("User deleted successfully");
			getAllDevelopers() // Refresh the user list after deletion
            setIsModalOpen(false);
        } catch (error) {
            toast.dismiss();
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user");
        }
    };

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold text-gray-100'>Users</h2>
                <div className='relative'>
                    <input
                        type='text'
                        placeholder='Search users...'
                        className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={searchTerm}
                        onChange={handleSearch}
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
                                Email
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                Username
                            </th>
                            {userAuth.user.role === "admin" && (
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className='divide-y divide-gray-700'>
                        {filteredUsers.map((user) => (
                            <motion.tr
                                key={user._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                        <div className='flex-shrink-0 h-10 w-10'>
                                            <div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
                                                {user.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div className='ml-4'>
                                            <div className='text-sm font-medium text-gray-100'>{user.name}</div>
                                        </div>
                                    </div>
                                </td>

                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-300'>{user.email}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-300'>{user.userName}</div>
                                </td>

                                {userAuth.user.role === "admin" && (
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                        <button className='text-indigo-400 hover:text-indigo-300 mr-2'>Edit</button>
                                        <button
                                            className='text-red-400 hover:text-red-300'
                                            onClick={() => confirmDeleteUser(user._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <WarningModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteUser}
                message="This action will permanently delete the user and remove them from all associated projects. Are you sure you want to proceed?"
            />
        </motion.div>
    );
};

export default UsersTable;
