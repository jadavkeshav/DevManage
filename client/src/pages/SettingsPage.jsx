import Header from "../components/common/Header";
import MyProjectsPage from "../components/settings/MyProjectsPage.js";
import Profile from "../components/settings/Profile";
import MoneyEarned from "../components/settings/MoneyEarned.jsx";

const SettingsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title='Settings' />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
				<Profile />
				<MyProjectsPage />
				<MoneyEarned />
			</main>
		</div>
	);
};
export default SettingsPage;
