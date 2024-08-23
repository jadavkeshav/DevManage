import { useState, useRef, useEffect } from 'react';
import { User } from 'lucide-react'; // Import User icon from lucide-react

const Header = ({ title }) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null); // Create a ref for the dropdown

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	const handleLogout = () => {
		// Handle logout logic here
		console.log("User logged out");
		setIsDropdownOpen(false); // Close dropdown after logout
	};

	// Handle clicks outside the dropdown
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<header className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 header-important'
			style={{ zIndex: 999, position: 'relative' }}	
		>
			<div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
				<h1 className='text-2xl font-semibold text-gray-100'>{title}</h1>
				<div className='relative' ref={dropdownRef}>
					<button
						onClick={toggleDropdown}
						className='flex items-center space-x-2 text-gray-100 focus:outline-none'
					>
						<User size={24} />
						<span className='hidden sm:inline-block'>Username</span>
					</button>
					{isDropdownOpen && (
						<div className='absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50'>
							<div className='py-2'>
								<button
									onClick={handleLogout}
									className='block w-full text-left px-4 py-2 text-gray-100 hover:bg-gray-700'
								>
									Logout
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
