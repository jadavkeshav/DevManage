import { Route, Routes } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage";
import ProtectedRoute from "./Protected/protectedRoute";
import SignIn from "./pages/signIn";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./session/session"
import MainLayout from "./Layout/MainLayout";
import ProductsPage from "./pages/ProductsPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import ProjectPage from "./components/products/ProjectPage";
import { Toaster } from 'react-hot-toast';
import SignUp from "./pages/SignUp";
import DevelopersPage from "./pages/DevelopersPage";

export const UserContext = createContext({});

function App() {
	const [userAuth, setUserAuth] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let userInSession = lookInSession("user");
		if (userInSession) {
			setUserAuth(JSON.parse(userInSession));
		} else {
			setUserAuth({ access_token: null });
		}
		setLoading(false);
	}, []);



	return (
		<UserContext.Provider value={{ userAuth, setUserAuth, loading }}>
			<Toaster position="top-center" reverseOrder={false} />
			<Routes>
				<Route index path="/signin" element={<SignIn />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} >
					<Route index element={<ProtectedRoute><OverviewPage /></ProtectedRoute>} />
					<Route path='/products' element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
					<Route path='/projects/:projectId' element={<ProtectedRoute><ProjectPage /></ProtectedRoute>} />
					<Route path='/developers' element={<ProtectedRoute><DevelopersPage /></ProtectedRoute>} />
					<Route path='/sales' element={<ProtectedRoute><SalesPage /></ProtectedRoute>} />
					{/* <Route path='/orders' element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} /> */}
					{/* <Route path='/analytics' element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} /> */}
					<Route path='/settings' element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
				</Route>
			</Routes>
		</UserContext.Provider>
	);
}

export default App;
