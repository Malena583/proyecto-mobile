import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar sesión activa al iniciar la app
  useEffect(() => {
    const cargarSesion = async () => {
      const activo = await AsyncStorage.getItem('usuario_activo');
      if (activo) {
        const usuarioSesion = JSON.parse(activo);
        setUsuario(usuarioSesion);
        const carritoGuardado = await AsyncStorage.getItem(`carrito_${usuarioSesion.email}`);
        setCarrito(carritoGuardado ? JSON.parse(carritoGuardado) : []);
      }
      setLoading(false);
    };
    cargarSesion();
  }, []);

  // Guardar carrito cada vez que cambia
  useEffect(() => {
    if (usuario) {
      AsyncStorage.setItem(`carrito_${usuario.email}`, JSON.stringify(carrito));
    }
  }, [carrito, usuario]);

  const registrarUsuario = async (nuevoUsuario) => {
    const usuariosGuardados = JSON.parse(await AsyncStorage.getItem('usuarios')) || [];

    const existe = usuariosGuardados.some(
      (u) => u.email.toLowerCase() === nuevoUsuario.email.toLowerCase()
    );
    if (existe) {
      return { success: false, message: 'El correo electrónico ya se encuentra registrado.' };
    }

    const listaActualizada = [...usuariosGuardados, nuevoUsuario];
    await AsyncStorage.setItem('usuarios', JSON.stringify(listaActualizada));

    await loginAuto(nuevoUsuario);
    return { success: true, message: `¡Bienvenido/a, ${nuevoUsuario.nombre}! Tu cuenta fue creada con éxito.` };
  };

  const loginUsuario = async (email, password) => {
    const usuariosGuardados = JSON.parse(await AsyncStorage.getItem('usuarios')) || [];
    const usuarioEncontrado = usuariosGuardados.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!usuarioEncontrado) {
      return { success: false, message: 'Correo o contraseña incorrectos.' };
    }

    await loginAuto(usuarioEncontrado);
    return { success: true };
  };

  const loginAuto = async (userObj) => {
    const usuarioSesion = { nombre: userObj.nombre, email: userObj.email };
    await AsyncStorage.setItem('usuario_activo', JSON.stringify(usuarioSesion));

    const carritoGuardado = await AsyncStorage.getItem(`carrito_${usuarioSesion.email}`);
    setCarrito(carritoGuardado ? JSON.parse(carritoGuardado) : []);

    setUsuario(usuarioSesion);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('usuario_activo');
    setUsuario(null);
    setCarrito([]);
  };

  const agregarProducto = (producto) => {
    if (!usuario) {
      return { success: false, message: 'Debes iniciar sesión o registrarte para agregar productos.' };
    }
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    return { success: true, message: 'Producto agregado al carrito con éxito.' };
  };

  const cambiarCantidad = (id, cambio) => {
    setCarrito((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nueva = item.cantidad + cambio;
          return { ...item, cantidad: Math.max(1, nueva) };
        }
        return item;
      })
    );
  };

  const eliminarProducto = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => setCarrito([]);

  const total = carrito.reduce((acc, item) => acc + item.price * item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        usuario,
        carrito,
        loading,
        registrarUsuario,
        loginUsuario,
        logout,
        agregarProducto,
        cambiarCantidad,
        eliminarProducto,
        vaciarCarrito,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};