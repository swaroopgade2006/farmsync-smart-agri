import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Order, Delivery } from '../types';
import { useData } from './DataContext';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'id' | 'itemTotal'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  getItemQuantity: (cropId: string, packSizeKg?: number) => number;
  clearCart: () => void;
  checkoutCart: (payload: {
    deliveryLocation: string;
    buyerPhone?: string;
    notes?: string;
  }) => Promise<Order[]>;
  itemCount: number;
  totalWeightKg: number;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  isFreeDelivery: boolean;
  freeDeliveryThreshold: number;
  amountUntilFreeDelivery: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'farmsync_v4_shopping_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    createDarkStoreExpressOrder, 
    darkStores, 
    getNearestDarkStore,
    updateDarkStoreInventory
  } = useData();
  const { currentUser, buyerProfile } = useAuth();

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  // Add Item to Cart
  const addToCart = (item: Omit<CartItem, 'id' | 'itemTotal'>) => {
    const packSize = item.packSizeKg || 1;
    const itemId = `${item.cropId}_${packSize}kg`;
    const qty = Math.max(1, item.quantity || 1);

    setCartItems(prev => {
      const existingIdx = prev.findIndex(i => i.id === itemId);
      if (existingIdx >= 0) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + qty;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          itemTotal: Math.round(newQty * packSize * item.pricePerKg)
        };
        return updated;
      } else {
        const newItem: CartItem = {
          ...item,
          id: itemId,
          packSizeKg: packSize,
          quantity: qty,
          itemTotal: Math.round(qty * packSize * item.pricePerKg)
        };
        return [...prev, newItem];
      }
    });

    try {
      confetti({
        particleCount: 35,
        spread: 45,
        origin: { y: 0.8, x: 0.9 }
      });
    } catch {}
  };

  // Remove Item from Cart
  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(i => i.id !== itemId));
  };

  // Update Quantity
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: newQuantity,
          itemTotal: Math.round(newQuantity * item.packSizeKg * item.pricePerKg)
        };
      }
      return item;
    }));
  };

  // Helper to get quantity of a crop currently in cart
  const getItemQuantity = (cropId: string, packSizeKg?: number) => {
    if (packSizeKg !== undefined) {
      const targetId = `${cropId}_${packSizeKg}kg`;
      const found = cartItems.find(i => i.id === targetId);
      return found ? found.quantity : 0;
    }
    return cartItems
      .filter(i => i.cropId === cropId)
      .reduce((sum, i) => sum + i.quantity, 0);
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalWeightKg = Number(
    cartItems.reduce((sum, item) => sum + (item.quantity * item.packSizeKg), 0).toFixed(2)
  );
  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);
  
  const freeDeliveryThreshold = 99;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold || cartItems.length === 0;
  const deliveryFee = cartItems.length === 0 ? 0 : (isFreeDelivery ? 0 : 10);
  const grandTotal = subtotal + deliveryFee;
  const amountUntilFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  // Multi-Item Checkout Flow
  const checkoutCart = async (payload: {
    deliveryLocation: string;
    buyerPhone?: string;
    notes?: string;
  }): Promise<Order[]> => {
    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    const buyerId = buyerProfile?.id || currentUser?.id || 'buyer_freshmart';
    const buyerName = buyerProfile?.businessName || currentUser?.fullName || 'Direct Consumer';
    const buyerPhone = payload.buyerPhone || currentUser?.phone || '+91 98480 11223';
    
    const userCity = buyerProfile?.operatingCity || currentUser?.operatingLocation || 'Vijayawada';
    const nearestStore = getNearestDarkStore(userCity) || darkStores[0];

    const createdOrders: Order[] = [];

    // Create individual express order records for each item in the cart
    for (const item of cartItems) {
      const totalItemWeight = item.quantity * item.packSizeKg;
      const order = await createDarkStoreExpressOrder({
        buyerId,
        buyerName,
        buyerBusinessName: buyerName,
        buyerPhone,
        darkStoreId: item.darkStoreId || nearestStore.id,
        cropId: item.cropId,
        cropName: item.cropName,
        cropVariety: item.cropVariety,
        packSizeKg: totalItemWeight,
        unitPrice: item.pricePerKg,
        deliveryLocation: payload.deliveryLocation,
        batchId: item.batchId,
        farmerName: item.farmerName,
      });

      createdOrders.push(order);
    }

    // Clear cart on successful placement
    clearCart();
    setIsCartOpen(false);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {}

    return createdOrders;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      getItemQuantity,
      clearCart,
      checkoutCart,
      itemCount,
      totalWeightKg,
      subtotal,
      deliveryFee,
      grandTotal,
      isFreeDelivery,
      freeDeliveryThreshold,
      amountUntilFreeDelivery
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
