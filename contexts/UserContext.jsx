import { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext(null);

const USERS_KEY = 'usuarios';
const SESSION_KEY = 'usuario_activo';

const leerUsuarios = async () => {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
};

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        if (raw) setUsuario(JSON.parse(raw));
      } catch (e) {
        console.error('Error al cargar sesión', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const iniciarSesion = async (u) => {
    const sesion = { nombre: u.nombre, email: u.email, avatarUri: u.avatarUri ?? null };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
    setUsuario(sesion);
  };

  const registrarUsuario = async (nuevo) => {
    const usuarios = await leerUsuarios();
    const existe = usuarios.some((u) => u.email.toLowerCase() === nuevo.email.toLowerCase());
    if (existe) {
      return { success: false, message: 'El correo electrónico ya se encuentra registrado.' };
    }
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...usuarios, nuevo]));
    await iniciarSesion(nuevo);
    return { success: true, message: `¡Bienvenido/a, ${nuevo.nombre}! Tu cuenta fue creada con éxito.` };
  };

  const loginUsuario = async (email, password) => {
    const usuarios = await leerUsuarios();
    const encontrado = usuarios.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!encontrado) return { success: false, message: 'Correo o contraseña incorrectos.' };
    await iniciarSesion(encontrado);
    return { success: true };
  };

  const logout = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUsuario(null);
  };

  // Actualiza la sesión y también la lista de usuarios, para que la foto sobreviva al logout
  const actualizarPerfil = async (patch) => {
    if (!usuario) return;
    const nuevo = { ...usuario, ...patch };
    setUsuario(nuevo);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(nuevo));
    const usuarios = await leerUsuarios();
    await AsyncStorage.setItem(
      USERS_KEY,
      JSON.stringify(usuarios.map((u) => (u.email === nuevo.email ? { ...u, ...patch } : u)))
    );
  };

  const cambiarFoto = (avatarUri) => actualizarPerfil({ avatarUri });

  const eliminarFoto = () => actualizarPerfil({ avatarUri: null });

  return (
    <UserContext.Provider
      value={{ usuario, loading, registrarUsuario, loginUsuario, logout, actualizarPerfil, cambiarFoto, eliminarFoto }}
    >
      {children}
    </UserContext.Provider>
  );
}