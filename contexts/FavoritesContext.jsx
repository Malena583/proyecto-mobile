import { createContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoritesContext = createContext(null);
const FAV_KEY = '@tienda:favorites';

export function FavoritesProvider({ children }) {
  const [favoritos, setFavoritos] = useState([]);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(FAV_KEY);
        if (raw && mounted) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const seen = new Set();
            const clean = [];
            for (const item of parsed) {
              if (item && item.id != null) {
                const idStr = String(item.id);
                if (!seen.has(idStr)) {
                  seen.add(idStr);
                  clean.push(item);
                }
              }
            }
            setFavoritos(clean);
          }
        }
      } catch (e) {
        console.error('Error al cargar favoritos', e);
      } finally {
        if (mounted) setListo(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!listo) return;
    AsyncStorage.setItem(FAV_KEY, JSON.stringify(favoritos)).catch(console.error);
  }, [favoritos, listo]);

  const esFavorito = useCallback((id) => favoritos.some((f) => String(f.id) === String(id)), [favoritos]);

  const alternarFavorito = useCallback((producto) => {
    if (!listo || !producto || producto.id == null) return;
    const idStr = String(producto.id);
    setFavoritos((prev) => {
      const existe = prev.some((f) => String(f.id) === idStr);
      if (existe) {
        return prev.filter((f) => String(f.id) !== idStr);
      }
      return [...prev, producto];
    });
  }, [listo]);

  const quitarFavorito = useCallback((id) => {
    if (!listo || id == null) return;
    const idStr = String(id);
    setFavoritos((prev) => prev.filter((f) => String(f.id) !== idStr));
  }, [listo]);

  const reordenarFavoritos = useCallback((nuevoOrden) => {
    if (!listo || !Array.isArray(nuevoOrden)) return;
    const validos = nuevoOrden.filter((item) => item && item.id != null);
    const seen = new Set();
    const clean = [];
    for (const item of validos) {
      const idStr = String(item.id);
      if (!seen.has(idStr)) {
        seen.add(idStr);
        clean.push(item);
      }
    }
    setFavoritos(clean);
  }, [listo]);

  return (
    <FavoritesContext.Provider
      value={{ favoritos, listo, esFavorito, alternarFavorito, quitarFavorito, reordenarFavoritos }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
