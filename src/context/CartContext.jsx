import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'cuyo_cebado_cart_v2';

const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
};

function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD_CART:
      return { ...state, items: action.payload };

    case ACTIONS.ADD_ITEM: {
      const { product, qty } = action.payload;
      const existing = state.items.find(item => item.id === product.id);

      if (existing) {
        const newQuantity = existing.quantity + qty;
        const safeQuantity = Math.min(newQuantity, existing.stock);

        return {
          ...state,
          items: state.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: safeQuantity }
              : item
          ),
        };
      }

      if (product.stock <= 0) return state;

      const safeNewQuantity = Math.min(qty, product.stock);

      return {
        ...state,
        items: [...state.items, { ...product, quantity: safeNewQuantity }]
      };
    }

    case ACTIONS.REMOVE_ITEM:
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };

    case ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id === action.payload.id) {
            const safeQuantity = Math.min(action.payload.quantity, item.stock);
            return { ...item, quantity: Math.max(0, safeQuantity) };
          }
          return item;
        }).filter(item => item.quantity > 0),
      };

    case ACTIONS.CLEAR_CART:
      return { ...state, items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) dispatch({ type: ACTIONS.LOAD_CART, payload: JSON.parse(saved) });
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (product, qty = 1) => dispatch({ type: ACTIONS.ADD_ITEM, payload: { product, qty } });

  const removeFromCart = (id) => dispatch({ type: ACTIONS.REMOVE_ITEM, payload: id });
  const updateQuantity = (id, quantity) => dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { id, quantity } });
  
  // Envolvemos clearCart en useCallback para evitar problemas de re-renderizados
  const clearCart = useCallback(() => {
      dispatch({ type: ACTIONS.CLEAR_CART });
      localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <CartContext.Provider value={{ cart: state.items, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}