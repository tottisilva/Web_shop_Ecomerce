import React, { useState, useEffect } from 'react';
import { commerce } from './lib/commerce';
import {NavBar, Products, Cart, Checkout} from './components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


const App = () => {

    const [products, setProducts] = useState([]);
    const [cart , setCart] = useState({});
    const [order, setOrder] = useState({});
    const {errorMensage, setErrorMessage} = useState('');


    const fetchProducts = async () =>{
        const { data } = await commerce.products.list();

        setProducts(data);
    };
    
    const fetchCart = async() => {
        const cart = await commerce.cart.retrieve();
        setCart(cart);
    };
    // Adding to Cart
    const handleAddToCart = async(productId, quantity) => {
        const { cart } = await commerce.cart.add(productId, quantity);

        setCart(cart);
    };
    // Update Cart
    const handleUpdateCartQty = async (productId, quantity) => {
        const { cart } = await commerce.cart.update(productId, { quantity });

        setCart(cart);
    };
    // Remove from de Cart
    const handleRemoveFromCart = async (productId) => {
        const { cart } = await commerce.cart.remove(productId);

        setCart(cart);
    };
    // Empty the Cart
    const handleEmptyCart = async () => {
        const {cart} = await commerce.cart.empty();

        setCart(cart);
    };

    // Empty Cart after the order
    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();

        setCart(newCart);
    };

    const handleCaptureChechout = async (checkoutTokenId, newOrder) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);

            setOrder(incomingOrder);
      
            refreshCart();
          } catch (error) {
            setErrorMessage(error.data.error.message);
          }
        };

    useEffect(() =>{
        fetchProducts();
        fetchCart();
    }, []);
    console.log(cart);

    

    
    return (
        <Router>
            <div>
                <NavBar totalItems={cart.total_items}  />
                <Switch>
                    <Route exact path='/' >
                        <Products products={products} onAddToCart={handleAddToCart}/>
                    </Route>
                    <Route exact path='/cart'>
                        <Cart cart={cart}
                            handleUpdateCartQty={ handleUpdateCartQty }
                            handleRemoveFromCart={ handleRemoveFromCart }
                            handleEmptyCart={handleEmptyCart}
                        />
                    </Route>
                    <Route exact path='/checkout'>
                        <Checkout
                            cart={cart}
                            order={order}
                            onCaptureCheckout={handleCaptureChechout}
                            error={errorMensage}
                         />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default App


