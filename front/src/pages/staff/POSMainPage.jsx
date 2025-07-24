import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';
import CartSummary from './CartSummary';
import QRScanner from './QRScanner';
import axiosInstance from '../../utils/axios';

const POSMainPage = () => {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await axiosInstance.get('/api/product');
            setProducts(res.data);
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const total = cartItems.reduce(
            (acc, item) => acc + item.quantity * item.price,
            0
        );
        setTotalAmount(total);
    }, [cartItems]);

    const addToCart = product => {
        const existing = cartItems.find(
            item => item.product._id === product._id
        );
        if (existing) {
            setCartItems(
                cartItems.map(item =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            setCartItems([
                ...cartItems,
                { product, quantity: 1, price: product.price },
            ]);
        }
    };

    return (
        <div className="grid grid-cols-12 h-screen overflow-hidden">
            <div className="col-span-8 p-6 overflow-y-auto bg-white border-r">
                <ProductList products={products} addToCart={addToCart} />
            </div>

            <div className="col-span-4 bg-gray-50 relative p-6">
                <div className="flex flex-col gap-4 h-full">
                    <div className="max-h-80 w-full rounded-md bg-white shadow p-2 overflow-hidden">
                        <div className="h-full">
                            <QRScanner onProductScanned={addToCart} />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <CartSummary
                            cartItems={cartItems}
                            totalAmount={totalAmount}
                        />
                    </div>
                </div>

                {/* <CartSummary cartItems={cartItems} totalAmount={totalAmount} /> */}
            </div>
        </div>
    );
};

export default POSMainPage;
