import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from './UserContext';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { usuario } = useContext(UserContext);
  const email = usuario?.email;

  const [carrito, setCarrito] = useState([]);
  const [cargadoPara, setCargadoPara] = useState(null);

  // Cargar el carrito del usuario activo
  useEffect(() => {
    if (!email) {
      setCarrito([]);
      setCargadoPara(null);
      return;
    }
    let cancelado = false;
    AsyncStorage.getItem(`carrito_${email}`).then((raw) => {
      if (cancelado) return;
      setCarrito(raw ? JSON.parse(raw) : []);
      setCargadoPara(email);
    });
    return () => {
      cancelado = true;
    };
  }, [email]);

  // Guardar solo cuando ya se cargó el carrito de ese usuario
  useEffect(() => {
    if (email && cargadoPara === email) {
      AsyncStorage.setItem(`carrito_${email}`, JSON.stringify(carrito)).catch(console.error);
    }
  }, [carrito, cargadoPara, email]);

  const agregarProducto = (producto) => {
    if (!usuario) {
      return { success: false, message: 'Debes iniciar sesión o registrarte para agregar productos.' };
    }
    setCarrito((prev) => {
      const existe = prev.find((i) => i.id === producto.id);
      if (existe) {
        return prev.map((i) => (i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i));
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    return { success: true, message: 'Producto agregado al carrito con éxito.' };
  };

  const cambiarCantidad = (id, cambio) =>
    setCarrito((prev) =>
      prev.map((i) => (i.id === id ? { ...i, cantidad: Math.max(1, i.cantidad + cambio) } : i))
    );

  const eliminarProducto = (id) => setCarrito((prev) => prev.filter((i) => i.id !== id));
  const vaciarCarrito = () => setCarrito([]);

  const comprar = () => {
    if (carrito.length === 0) {
      return { success: false, message: 'El carrito está vacío.' };
    }
    if (!usuario) {
      return { success: false, message: 'Debes iniciar sesión para comprar.' };
    }
    const totalCompra = carrito.reduce((acc, i) => acc + i.price * i.cantidad, 0);
    setCarrito([]);
    return { success: true, message: `¡Compra realizada con éxito! Total: $${totalCompra.toFixed(2)}` };
  };

  const total = carrito.reduce((acc, i) => acc + i.price * i.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ carrito, agregarProducto, cambiarCantidad, eliminarProducto, vaciarCarrito, comprar, total }}
    >
      {children}
    </CartContext.Provider>
  );
}