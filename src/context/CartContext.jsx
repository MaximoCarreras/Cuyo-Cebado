import { createContext, useContext, useReducer, useEffect } from 'react';

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
      // Ahora recibimos el producto Y la cantidad que el cliente eligió
      const { product, qty } = action.payload;
      const existing = state.items.find(item => item.id === product.id);

      if (existing) {
        // VALIDACIÓN: Calculamos la nueva cantidad sin pasarnos del stock
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

      // Si es nuevo pero no hay stock, no agregamos
      if (product.stock <= 0) return state;

      // Nos aseguramos de no agregar más del stock disponible en la primera compra
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

  // Le pasamos la cantidad (por defecto 1, por si lo agregás rápido desde el catálogo)
  const addToCart = (product, qty = 1) => dispatch({ type: ACTIONS.ADD_ITEM, payload: { product, qty } });

  const removeFromCart = (id) => dispatch({ type: ACTIONS.REMOVE_ITEM, payload: id });
  const updateQuantity = (id, quantity) => dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { id, quantity } });

  return (
    <CartContext.Provider value={{ cart: state.items, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}