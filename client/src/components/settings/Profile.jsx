import { useContext, useEffect, useState } from "react";
import { User, Pencil } from "lucide-react";
import SettingSection from "./SettingSection";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../../App";
import { CircularProgress } from "@mui/material";

const Profile = () => {
	const [user, setUser] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		userName: ''
	});

	const { userAuth: { token } } = useContext(UserContext);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
					headers: {
						"Authorization": `Bearer ${token}`
					}
				});
				setUser(data);
				setFormData({
					name: data.name,
					phone: data.phone,
					userName: data.userName
				});
			} catch (error) {
				toast.error('Failed to fetch user data');
			}
		};

		fetchUser();
	}, [token]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { data } = await axios.put(`${import.meta.env.VITE_BASE_URL}/users/profile`, formData, {
				headers: {
					"Authorization": `Bearer ${token}`
				}
			});
			setUser(data);
			setIsEditing(false);
			toast.success('Profile updated successfully');
		} catch (error) {
			// console.log(error)
			toast.error(error.response.data.message);
		}
	};

	if (!user) {
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
	};

	return (
		<SettingSection icon={User} title={"Profile"}>
			<div className='flex flex-col sm:flex-row items-center mb-6 relative'>
				<div className='h-20 w-20 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold mx-6 mb-3'>
					{user.name.charAt(0)}
				</div>

				<div className='flex-grow'>
					<h3 className='text-lg font-semibold text-gray-100'>{user.userName} </h3>
					<p className='text-gray-400'>{user.email}</p>
				</div>

				<button
					onClick={() => setIsEditing(!isEditing)}
					className='absolute right-6 top-6 text-indigo-600 hover:text-indigo-700'
				>
					<Pencil size={20} />
				</button>
			</div>

			{isEditing && (
				<form onSubmit={handleSubmit} className='flex flex-col space-y-4 mt-4'>
					<input
						type='text'
						name='name'
						value={formData.name}
						onChange={handleChange}
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 py-2'
						placeholder='Name'
					/>
					<input
						type='text'
						name='phone'
						value={formData.phone}
						onChange={handleChange}
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 py-2'
						placeholder='Phone'
					/>
					<input
						type='text'
						name='userName'
						value={formData.userName}
						onChange={handleChange}
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 py-2'
						placeholder='Username'
					/>

					<button
						type='submit'
						className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full'
					>
						Save Changes
					</button>
				</form>
			)}
		</SettingSection>
	);
};

export default Profile;
