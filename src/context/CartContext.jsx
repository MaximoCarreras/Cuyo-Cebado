/**
 * CartContext — Global cart state management
 * Uses React Context + useReducer for predictable state updates.
 * Persists cart to localStorage so it survives page refreshes. [SF]
 */
import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'mates_mendoza_cart';

/* Action types as constants to avoid magic strings [CMV] */
const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
};

/**
 * Cart reducer — handles all cart mutations.
 * Each item has: { id, name, price, image_url, quantity, stock }
 */
function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD_CART:
      return { ...state, items: action.payload };

    case ACTIONS.ADD_ITEM: {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        /* Don't exceed available stock [IV] */
        const newQty = Math.min(existing.quantity + 1, existing.stock);
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id ? { ...item, quantity: newQty } : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }

    case ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, Math.min(action.payload.quantity, item.stock)) }
            : item
        ).filter(item => item.quantity > 0),
      };

    case ACTIONS.CLEAR_CART:
      return { ...state, items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  /* Load cart from localStorage on mount [RM] */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        dispatch({ type: ACTIONS.LOAD_CART, payload: JSON.parse(saved) });
      }
    } catch {
      /* Silently handle corrupted storage */
    }
  }, []);

  /* Persist cart to localStorage on every change */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  /* Computed values */
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addItem = (product) => dispatch({ type: ACTIONS.ADD_ITEM, payload: product });
  const removeItem = (id) => dispatch({ type: ACTIONS.REMOVE_ITEM, payload: id });
  const updateQuantity = (id, quantity) => dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { id, quantity } });
  const clearCart = () => dispatch({ type: ACTIONS.CLEAR_CART });

  return (
    <CartContext.Provider value={{
      items: state.items,
      itemCount,
      total,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * Custom hook for consuming cart context.
 * Throws if used outside CartProvider. [REH]
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
