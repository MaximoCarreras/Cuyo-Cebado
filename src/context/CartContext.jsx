/**
 * CartContext — Gestión global del carrito para Cuyo Cebado.
 * Usa useReducer para actualizaciones predecibles y persiste los datos en localStorage.
 */
import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'cuyo_cebado_cart_v1';

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
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        // No exceder el stock disponible si existe el dato
        const newQty = action.payload.stock
          ? Math.min(existing.quantity + 1, action.payload.stock)
          : existing.quantity + 1;

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
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
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

  // Carga inicial desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        dispatch({ type: ACTIONS.LOAD_CART, payload: JSON.parse(saved) });
      }
    } catch (error) {
      console.error("Error cargando el carrito:", error);
    }
  }, []);

  // Persistencia automática
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  // Valores calculados para exportar
  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Funciones de despacho (renombradas para coincidir con tus componentes)
  const addToCart = (product) => dispatch({ type: ACTIONS.ADD_ITEM, payload: product });
  const removeFromCart = (id) => dispatch({ type: ACTIONS.REMOVE_ITEM, payload: id });
  const updateQuantity = (id, quantity) => dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { id, quantity } });
  const clearCart = () => dispatch({ type: ACTIONS.CLEAR_CART });

  return (
    <CartContext.Provider value={{
      cart: state.items,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}