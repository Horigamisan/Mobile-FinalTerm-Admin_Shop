import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home, ShopDetail, SignIn } from './pages';
import SignInContext from './context';
import axiosInstance from './api';

const App = () => {
	const [token, setToken] = useState(localStorage.getItem('token'));
	const [isLoggedIn, setIsLoggedIn] = useState(true);

	useEffect(() => {
		if (!token) {
			setIsLoggedIn(false);
		} else {
			axiosInstance
				.post(
					'/auth/signin',
					{},
					{
						headers: {
							Authorization: 'Bearer ' + token,
						},
					}
				)
				.catch((err) => {
					if (
						err.response.data.message &&
						err.response.data.message ===
							'This endpoint is only for anonymous user'
					) {
						setIsLoggedIn(true);
					}
				});
		}
	}, []);

	return (
		<SignInContext.Provider
			value={{ token, setToken, isLoggedIn, setIsLoggedIn }}
		>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/shops/:id" element={<ShopDetail />} />
				<Route path="/signin" element={<SignIn />} />
			</Routes>
		</SignInContext.Provider>
	);
};

export default App;
