import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartService } from '@/data/services/cart.service';
import { OrderService } from '@/data/services/order.service';
import { ICart } from '@/data/models/cart.model';

interface CartContextType {
    cartCount: number;
    orderCount: number;
    refreshCartCount: () => Promise<void>;
    refreshOrderCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);

    const refreshCartCount = useCallback(async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (userId) {
                const response = await CartService.getCartasync();
                if (response.success && response.data) {
                    const count = response.data.items.reduce((acc, item) => acc + item.qty, 0);
                    setCartCount(count);
                }
            } else {
                const guestCart = localStorage.getItem('guestCart');
                if (guestCart) {
                    const cart: ICart = JSON.parse(guestCart);
                    const count = cart.items.reduce((acc, item) => acc + item.qty, 0);
                    setCartCount(count);
                } else {
                    setCartCount(0);
                }
            }
        } catch (error) {
            console.error('Error refreshing cart count:', error);
            setCartCount(0);
        }
    }, []);

    const refreshOrderCount = useCallback(async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (userId) {
                const response = await OrderService.getListasync();
                if (response.success && response.data) {
                    setOrderCount(response.data.length);
                }
            } else {
                setOrderCount(0);
            }
        } catch (error) {
            console.error('Error refreshing order count:', error);
            setOrderCount(0);
        }
    }, []);

    useEffect(() => {
        refreshCartCount();
        refreshOrderCount();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'guestCart' || e.key === 'userId' || e.key === 'userData') {
                refreshCartCount();
                refreshOrderCount();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [refreshCartCount, refreshOrderCount]);

    return (
        <CartContext.Provider value={{ cartCount, orderCount, refreshCartCount, refreshOrderCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
