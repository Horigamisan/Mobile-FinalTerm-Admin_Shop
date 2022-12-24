import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api';
import SignInContext from '../context';

const Home = () => {
	const { token, isLoggedIn } = useContext(SignInContext);
	const navigate = useNavigate();
	const [listName, setListName] = useState('users');
	const [list, setList] = useState([]);
	const [page, setPage] = useState(1);

	const censor = (id, action) => {
		return () => {
			axiosInstance
				.post(
					`/admin/shops/${id}/${action}`,
					{},
					{
						headers: {
							Authorization: 'Bearer ' + token,
						},
					}
				)
				.then((response) => {
					console.log(response.data);
					setPage(1);
					setList([]);
				})
				.catch((err) => console.error(err));
		};
	};

	useEffect(() => {
		if (!isLoggedIn) {
			navigate('/signin');
		}
	}, [isLoggedIn]);

	useEffect(() => {
		setPage(1);
	}, [listName]);

	useEffect(() => {
		const query = [`page=${page}`];
		let searchTerm = listName;

		if (listName === 'unverified-shops') {
			searchTerm = 'shops';
			query.push('unverified=1');
		}

		if (token) {
			axiosInstance
				.get(`/admin/${searchTerm}?${query.join('&')}`, {
					headers: {
						Authorization: 'Bearer ' + token,
					},
				})
				.then((response) => {
					const res = response.data;
					setList(res);
				})
				.catch((err) => console.error(err));
		}
	}, [page, listName]);

	// useEffect(() => {
	// 	setPage(1);
	// 	const query = [`page=${page}`];
	// 	let searchTerm = listName;

	// 	if (listName === 'unverified-shops') {
	// 		searchTerm = 'shops';
	// 		query.push('unverified=1');
	// 	}
	// 	// console.log(token);
	// 	if (token) {
	// 		axiosInstance
	// 			.get(`/admin/${searchTerm}?${query.join('')}`, {
	// 				headers: {
	// 					Authorization: 'Bearer ' + token,
	// 				},
	// 			})
	// 			.then((response) => {
	// 				const res = response.data;
	// 				setList(res);
	// 			})
	// 			.catch((err) => console.error(err));
	// 	}
	// }, [listName]);

	return (
		<div className="container">
			<h1>Quản lí hệ thống</h1>
			<div className="tab-header">
				<ul className="nav nav-pills justify-content-center">
					<li className="nav-item">
						<button
							className={`nav-link ${listName === 'users' ? 'active' : ''}`}
							onClick={() => {
								setListName('users');
								setList([]);
							}}
							aria-current="page"
						>
							Người dùng
						</button>
					</li>
					<li className="nav-item">
						<button
							className={`nav-link ${listName === 'shops' ? 'active' : ''}`}
							onClick={() => {
								setListName('shops');
								setList([]);
							}}
						>
							Cửa hàng
						</button>
					</li>
					<li className="nav-item">
						<button
							className={`nav-link ${
								listName === 'unverified-shops' ? 'active' : ''
							}`}
							onClick={() => {
								setListName('unverified-shops');
								setList([]);
							}}
						>
							Cửa hàng đang chờ xác nhận
						</button>
					</li>
				</ul>
			</div>

			<table className="table table-bordered table-striped table-hover">
				{listName === 'users' && (
					<>
						<thead className="thead-dark">
							<tr>
								<th>Số thứ tự</th>
								<th>Tên</th>
								<th>Email</th>
								<th>Số điện thoại</th>
								<th>Ngày sinh</th>
								<th>Giới tính</th>
							</tr>
						</thead>

						<tbody>
							{list.length > 0 ? (
								list.map((item, index) => {
									return (
										<tr>
											<td>{index + 1}</td>
											<td>{item.name}</td>
											<td>{item.email}</td>
											<td>{item.tel}</td>
											<td>{item.birthDate}</td>
											<td>{item.gender}</td>
										</tr>
									);
								})
							) : (
								<tr>
									<td colspan="6">Không có dữ liệu</td>
								</tr>
							)}
						</tbody>
					</>
				)}

				{listName !== 'users' && (
					<>
						<thead className="thead-dark">
							<tr>
								<th>Số thứ tự</th>
								<th>Tên</th>
								<th>Chủ</th>
								<th>Địa chỉ</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{list.length > 0 ? (
								list.map((item, index) => {
									return (
										<tr>
											<td>{index + 1}</td>
											<td>{item.name}</td>
											<td>{item.owner.name}</td>
											<td>{item.address}</td>
											<td className="functionalities">
												<Link to={`/shops/${item._id}`}>
													<button type="button" className="btn btn-success">
														Xem chi tiết
													</button>
												</Link>

												{listName === 'unverified-shops' && (
													<>
														<button
															type="button"
															className="btn btn-primary mx-2"
															onClick={censor(item._id, 'allow')}
														>
															Duyệt
														</button>
														<button
															type="button"
															className="btn btn-danger"
															onClick={censor(item._id, 'reject')}
														>
															Từ chối
														</button>
													</>
												)}
											</td>
										</tr>
									);
								})
							) : (
								<tr>
									<td colspan="6">Không có dữ liệu</td>
								</tr>
							)}
						</tbody>
					</>
				)}
			</table>
		</div>
	);
};

export default Home;
