import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {NavLink} from 'react-router-dom'
import style from './SubTotal.module.css'


function SubTotal({qty, userLogged}) {

    let user = useSelector((state) => state.user.authenticated);

    const cartProducts = useSelector((state) => state.cart.cart);
    
    // const [subtotal, setSubtotal] = useState({
    //     newSubtotal: subtotal * qty
    // })



	return (
		<div>
            <div className={style.subtotalContainerMain}>
                <h1>Subtotal:</h1>
                <h1>0</h1>
                {user ? 
                    <NavLink to='/payment'>
                    <button className={style.paymentButton}>GO TO PAY</button>
                    </NavLink> 
                    : <NavLink to='/login'>
                    <button className={style.paymentButton}>GO TO PAY</button>
                    </NavLink>
                    }
                
            </div>
		</div>
	);

}

export default SubTotal;