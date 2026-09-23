import { useContext } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CartContext } from '../../contexts/CartContext';
import { colors, typography, radius, spacing } from '../../theme';

export default function Carrito() {
  const { carrito, cambiarCantidad, eliminarProducto, vaciarCarrito, total } = useContext(CartContext);

  if (carrito.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Tu carrito está vacío</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={carrito}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              <View style={styles.cantidadRow}>
                <Pressable style={styles.qtyButton} onPress={() => cambiarCantidad(item.id, -1)}>
                  <Text style={styles.qtyText}>-</Text>
                </Pressable>
                <Text style={styles.cantidad}>{item.cantidad}</Text>
                <Pressable style={styles.qtyButton} onPress={() => cambiarCantidad(item.id, 1)}>
                  <Text style={styles.qtyText}>+</Text>
                </Pressable>
              </View>
            </View>
            <Pressable onPress={() => eliminarProducto(item.id)}>
              <Text style={styles.eliminar}>Quitar</Text>
            </Pressable>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
        <Pressable style={styles.vaciarButton} onPress={vaciarCarrito}>
          <Text style={styles.vaciarText}>Vaciar carrito</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  emptyText: { color: colors.textSecondary, fontSize: 16 },
  item: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  image: { width: 60, height: 60, borderRadius: radius.sm, marginRight: spacing.sm },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  price: { fontSize: 13, color: colors.secondaryDark, marginTop: 2 },
  cantidadRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 10 },
  qtyButton: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.secondaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyText: { fontWeight: '700', color: colors.secondaryDark },
  cantidad: { fontWeight: '600' },
  eliminar: { color: '#c0392b', fontSize: 12, marginLeft: spacing.sm },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: colors.surface,
  },
  total: { ...typography.h4, marginBottom: spacing.sm },
  vaciarButton: { alignItems: 'center', paddingVertical: 10 },
  vaciarText: { color: colors.textSecondary },
});