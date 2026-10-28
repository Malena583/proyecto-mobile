import { useContext } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { CartContext } from '../contexts/CartContext';
import { FavoritesContext } from '../contexts/FavoritesContext';
import { colors, typography, radius, spacing } from '../theme';

export default function ProductCard({ product }) {
  const router = useRouter();
  const { agregarProducto } = useContext(CartContext);
  const { esFavorito, alternarFavorito, listo } = useContext(FavoritesContext);
  const fav = esFavorito(product.id);
  const cargando = !listo;

  const handleAgregar = () => {
    const respuesta = agregarProducto(product);
    if (!respuesta.success) {
      Alert.alert('Atención', respuesta.message, [
        { text: 'OK', onPress: () => router.push('/registro') },
      ]);
    } else {
      Alert.alert('Listo', respuesta.message);
    }
  };

  const handleComprar = () => {
    // Agregar al carrito y luego comprar directamente
    const respuesta = agregarProducto(product);
    if (!respuesta.success) {
      Alert.alert('Atención', respuesta.message, [
        { text: 'OK', onPress: () => router.push('/registro') },
      ]);
      return;
    }
    // Navegar al carrito para confirmar compra
    router.push('/(tabs)/carrito');
  };

  return (
    <View style={styles.card}>
      <Pressable onPress={() => router.push(`/producto/${product.id}`)}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        <View style={styles.info}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        </View>
      </Pressable>

      <Pressable
        style={styles.heart}
        onPress={(e) => {
          e?.stopPropagation?.();
          if (!cargando) alternarFavorito(product);
        }}
        hitSlop={8}
        disabled={cargando}
      >
        <Ionicons
          name={fav ? 'heart' : 'heart-outline'}
          size={22}
          color={cargando ? colors.textSecondary : fav ? colors.secondaryDark : colors.textSecondary}
          opacity={cargando ? 0.5 : 1}
        />
      </Pressable>

      <View style={styles.actions}>
        <Pressable style={styles.addButton} onPress={handleAgregar}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </Pressable>
        <Pressable style={styles.buyButton} onPress={handleComprar}>
          <Text style={styles.buyButtonText}>Comprar</Text>
        </Pressable>
        <Pressable
          style={styles.detailButton}
          onPress={() => router.push(`/producto/${product.id}`)}
        >
          <Text style={styles.detailButtonText}>Ver detalle</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    marginHorizontal: spacing.sm,
    flex: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  image: { width: '100%', height: 140, backgroundColor: colors.white },
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    zIndex: 10,
  },
  info: { padding: spacing.sm, paddingBottom: 0 },
  category: { color: colors.textSecondary, fontSize: 12, marginBottom: 2 },
  title: { ...typography.h4, color: colors.textPrimary, marginBottom: 4, minHeight: 40 },
  price: { ...typography.button, color: colors.secondaryDark },
  actions: { padding: spacing.sm, gap: 6 },
  addButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  addButtonText: { color: colors.white, fontSize: 13, fontWeight: '600' },
  buyButton: {
    backgroundColor: colors.secondaryDark,
    paddingVertical: 8,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  buyButtonText: { color: colors.white, fontSize: 13, fontWeight: '600' },
  detailButton: {
    borderWidth: 1,
    borderColor: colors.secondaryLight,
    paddingVertical: 8,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  detailButtonText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
});
