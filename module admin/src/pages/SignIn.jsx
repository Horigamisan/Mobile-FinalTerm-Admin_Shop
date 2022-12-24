import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api';
import SignInContext from '../context';

const SignIn = () => {
	const { token, setToken, isLoggedIn, setIsLoggedIn } =
		useContext(SignInContext);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		if (isLoggedIn) {
			navigate('/');
		}
	}, [isLoggedIn]);

	return (
		// <div className="container">
		<div className="container">
			<div className="row justify-content-center mt-5">
				<div className="col-lg-4 col-md-6 col-sm-6">
					<div className="card shadow">
						<div className="card-title text-center border-bottom">
							<h2 className="p-3">Đăng nhập</h2>
						</div>
						<div className="card-body">
							<form>
								<div className="mb-4">
									<label for="username" className="form-label">
										Email
									</label>
									<input
										type="text"
										className="form-control"
										id="email"
										name="email"
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
								<div className="mb-4">
									<label for="password" className="form-label">
										Mật khẩu
									</label>
									<input
										type="password"
										className="form-control"
										id="password"
										name="password"
										onChange={(e) => setPassword(e.target.value)}
									/>
								</div>
								<div className="mb-4">
									<input
										type="checkbox"
										className="form-check-input"
										id="remember"
									/>
									<label for="remember" className="form-label">
										Giữ tôi đăng nhập
									</label>
								</div>
								<div className="d-grid">
									<button
										type="submit"
										className="btn text-light btn-primary"
										onClick={(e) => {
											e.preventDefault();

											axiosInstance
												.post(
													'/auth/signin',
													{
														email,
														password,
													},
													{
														headers: {
															Authorization: 'Bearer ' + token,
														},
													}
												)
												.then((res) => {
													const token = res.data.token;

													if (token) {
														localStorage.setItem('token', token);
														setToken(token);
														setIsLoggedIn(true);
													}
												})
												.catch((err) => console.log('err', err.message));
										}}
									>
										Đăng nhập
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignIn;
