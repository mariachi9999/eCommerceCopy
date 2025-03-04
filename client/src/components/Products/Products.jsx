import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
	getProducts,
	getFilteredProducts,
	selectPage,
	cleanFilters,
	addToCart,
	removeFromCart
} from '../../Redux/actions';
import FavoriteButton from '../FavoriteComponent/FavoriteButton';
import { Link } from 'react-router-dom';
import styles from './Products.module.css';
import PagingBox from '../PagingBox/PagingBox';
import ButtonCrypto from '../StyledComponents/ButtonCrypto';
import Loader from '../Loader/Loader';
import './index.css';
function Products() {
	/// Crypto
	const arsBtc = useSelector(state => state.crypto.arsBtc);
	const rateUpdateTime = useSelector(state => state.crypto.updateTime);
	const btcRate = parseFloat(arsBtc);

	const dispatch = useDispatch();
	let allProducts = useSelector(state => state.product.allProducts);

	let filteredProducts = useSelector(state => state.product.filterByCategories);

	let productsToRender = allProducts;

	if (filteredProducts) {
		productsToRender = filteredProducts;
	}

	let stockS = useSelector(state => state.stock.order);
	let categoryS = useSelector(state => state.category.selectedCategory);
	let brandS = useSelector(state => state.brands.selectedBrand);
	let priceS = useSelector(state => state.price.order);
	let actualPage = useSelector(state => state.product.page);
	let productsPerPage = window.screen.width > 430 ? 9 : 4	
	let [query, setQuery] = useState({
		category: categoryS,
		brand: brandS,
		price: priceS,
		page: actualPage,
		qty: productsPerPage,
		stock: stockS
	});

	useEffect(() => {
		setQuery({
			category: categoryS,
			brand: brandS,
			price: priceS,
			page: actualPage,
			qty: productsPerPage,
			stock: stockS
		});
		return () => {
			dispatch(cleanFilters());
		};
	}, []);

	useEffect(() => {
		setQuery({
			...query,
			category: categoryS
		});
	}, [categoryS]);

	useEffect(() => {
		setQuery({
			...query,
			brand: brandS
		});
	}, [brandS]);

	useEffect(() => {
		setQuery({
			...query,
			price: priceS
		});
	}, [priceS]);

	useEffect(() => {
		setQuery({
			...query,
			stock: stockS
		});
	}, [stockS]);

	useEffect(() => {
		setQuery({
			...query,
			page: actualPage
		});
	}, [actualPage]);

	useEffect(() => {
		dispatch(getFilteredProducts(query));
	}, [query]);

	var formatNumber = {
		separator: '.',
		decimalSeparator: ',',
		formatear: function(num) {
			num += '';
			var splitStr = num.split('.');
			var splitLeft = splitStr[0];
			var splitRight =
				splitStr.length > 1 ? this.decimalSeparator + splitStr[1] : '';
			var regx = /(\d+)(\d{3})/;
			while (regx.test(splitLeft)) {
				splitLeft = splitLeft.replace(regx, '$1' + this.separator + '$2');
			}
			return this.simbol + splitLeft + splitRight;
		},
		new: function(num, simbol) {
			this.simbol = simbol || '';
			return this.formatear(num);
		}
	};
	console.log(productsToRender)
	return (
		<div className={styles.cardsContainer}>
			{productsToRender
				? productsToRender.map(p => {
						if (p.name.length > 55) {
							var aux = p.name.slice(0, 55).concat('...');
							p.name = aux;
						}
						var formatPrice = formatNumber.new(p.price, '$');
						return p.isVisible === true ? (
							<div key={p.id} className={styles.card}>
								<div className={styles.buttonCrypto}>
									<ButtonCrypto>
										₿ {(p.price * btcRate).toFixed(6)}
									</ButtonCrypto>
								</div>
								<Link key={p.id} to={`/catalog/${p.id}`}>
									<div className={styles.cardImage}>
										<img className={styles.img} src={p.image} alt='product' />
									</div>
								</Link>
								<div>
									<hr id={styles.line} />
								</div>

								<div className={styles.data}>
									<span className={styles.productName}>{p.name}</span>
									<div className={styles.heartDiv}>
										<FavoriteButton prod={p} />
									</div>
								</div>
								<div className={styles.footerCard}>
									<div className='footerCard d-flex justify-content-center'>
										<div className={styles.productPrice}>
											<span>{formatPrice}</span>
										</div>

										<div className={styles.buttonBuy}>
											{p.stock > 0 ? (
												<button
													id={styles.btnBuy}
													type='submit'
													onClick={() => dispatch(addToCart(p))}
												>
													Add to Cart
												</button>
											) : (
												<button type='submit'>Sin Stock</button>
											)}
										</div>
									</div>
								</div>
								<div id={styles.paginado}></div>
							</div>
						): null
				  	})
				: null}
			<PagingBox productsPerPage={productsPerPage} />
		</div>
	);
}

export default Products;
