import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api';
import SignInContext from '../context';

const ShopDetail = () => {
	const { id } = useParams();
	const { token } = useContext(SignInContext);
	const [data, setData] = useState(null);
	const navigate = useNavigate();

	const backToPrevious = () => {
		navigate(-1);
	};

	useEffect(() => {
		axiosInstance
			.get('/shops/' + id, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				setData(response.data);
			})
			.catch((err) => console.error(err));
	}, []);

	if (!data) return <p>Loading...</p>;

	if (!data.shop) return <p>Shop is recently deleted</p>;
	console.log(data);

	return (
		<>
			<h1>Chi tiết cửa hàng</h1>
			<div className="d-flex justify-content-center align-items-center">
				<div className="img d-flex align-items-center detail-card p-3">
					<img
						src="https://firebasestorage.googleapis.com/v0/b/tdtu-market.appspot.com/o/products%2F21407e7d-9b8a-4e98-9966-6a4755805eac.jpeg?alt=media&token=0623e2a0-5427-4479-8437-2343570b122f"
						className="ml-2"
						alt="..."
					/>

					<div className="detail">
						<div>
							<span>Tên:</span> {data.shop.name}
						</div>

						<div>
							<span>Chủ:</span> {data.shop.owner.name ?? 'no name'}
						</div>

						<div>
							<span>Giờ hoạt động:</span> {data.shop.shopOpenTime}h đến{' '}
							{data.shop.shopCloseTime}h
						</div>

						<div>
							<span>Review:</span> {data.shop.reviews ?? 0} lượt review
							<span className="ratings">Số sao:</span>{' '}
							{(data.shop.sumOfRating / data.shop.noOfRatings).toFixed(2)} sao
						</div>

						<div className="can-overflow">
							<span>Một số sản phẩm của cửa hàng: </span>
							{data.products.map((product) => product.name).join(', ')}
						</div>

						<div>
							<span>Trạng thái:</span>{' '}
							{data.shop.status === 'unverified'
								? 'chưa xác nhận'
								: data.shop.status === 'opened'
								? 'mở cửa'
								: 'đóng cửa'}
						</div>
					</div>
				</div>

				{/* <h1>Một số sản phẩm của shop</h1>
				<ol>
					{data.products.map((product) => (
						<li key={product._id}>
							<p>Tên: {product.name}</p>
							<p>Giá: {product.price}</p>
							<p>
								Số sao: {(product.sumOfRating / product.noOfRatings).toFixed(2)}
							</p>
							<p>Đã bán: {product.soldQuantity}</p>
						</li>
					))}
				</ol>
				<button onClick={backToPrevious}>Quay lại trang trước</button> */}
			</div>
		</>
	);
};

export default ShopDetail;
