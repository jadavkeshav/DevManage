import { Route, Routes } from "react-router-dom";

// import Sidebar from "./components/common/Sidebar";
import "./index.css"
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import MainLayout from "./Layout/MainLayout";
import TeamPage from "./pages/TeamPage";
import ProjectPage from "./components/products/ProjectPage";
function App() {

	return (
		<MainLayout>
			<Routes>
				<Route path='/' element={<OverviewPage />} />
				<Route path='/products' element={<ProductsPage />} />
				<Route path='/projects/:projectId' element={<ProjectPage />} />
				<Route path='/users' element={<UsersPage />} />
				<Route path='/team' element={<TeamPage />} />
				<Route path='/sales' element={<SalesPage />} />
				<Route path='/orders' element={<OrdersPage />} />
				<Route path='/analytics' element={<AnalyticsPage />} />
				<Route path='/settings' element={<SettingsPage />} />
			</Routes>
		</MainLayout>
	);
}

export default App;
