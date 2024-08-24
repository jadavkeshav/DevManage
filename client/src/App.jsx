import { Navigate, Route, Routes } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage";
import ProtectedRoute from "./Protected/protectedRoute";
import SignIn from "./pages/signIn";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./session/session"
import MainLayout from "./Layout/MainLayout";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import TeamPage from "./pages/TeamPage";
import ProjectPage from "./components/products/ProjectPage";

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
				<Routes>
					<Route index path="/signin" element={<SignIn />} />

					<Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} >
						<Route index element={<ProtectedRoute><OverviewPage /></ProtectedRoute>} />
						<Route path='/products' element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
						<Route path='/projects/:projectId' element={<ProtectedRoute><ProjectPage /></ProtectedRoute>} />
						<Route path='/users' element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
						<Route path='/team' element={<ProtectedRoute><TeamPage /></ProtectedRoute>} />
						<Route path='/sales' element={<ProtectedRoute><SalesPage /></ProtectedRoute>} />
						<Route path='/orders' element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
						<Route path='/analytics' element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
						<Route path='/settings' element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
					</Route>
				</Routes>
		</UserContext.Provider>
	);
}

export default App;
