import { useContext } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CartContext } from '../contexts/CartContext';
import { colors, typography, radius, spacing } from '../theme';

export default function ProductCard({ product }) {
  const router = useRouter();
  const { agregarProducto } = useContext(CartContext);

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

  return (
    <View style={styles.card}>
      <Pressable onPress={() => router.push(`/producto/${product.id}`)}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        </View>
      </Pressable>

      <View style={styles.actions}>
        <Pressable style={styles.addButton} onPress={handleAgregar}>
          <Text style={styles.addButtonText}>Agregar</Text>
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
  image: { width: '100%', height: 140 },
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
  detailButton: {
    borderWidth: 1,
    borderColor: colors.secondaryLight,
    paddingVertical: 8,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  detailButtonText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
});
