import { useContext } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import products from '../../data/products.json';
import { CartContext } from '../../contexts/CartContext';
import { colors, typography, radius, spacing } from '../../theme';

export default function DetalleProducto() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { agregarProducto } = useContext(CartContext);
  const product = products.find((p) => String(p.id) === String(id));

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Producto no encontrado</Text>
      </View>
    );
  }

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
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>

      <Pressable style={styles.button} onPress={handleAgregar}>
        <Text style={styles.buttonText}>Agregar al carrito</Text>
      </Pressable>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Volver</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, backgroundColor: colors.background, flexGrow: 1 },
  image: { width: '100%', height: 260, borderRadius: radius.lg, marginBottom: spacing.md },
  category: { color: colors.textSecondary, fontSize: 13, marginBottom: 4 },
  title: { ...typography.h3, color: colors.textPrimary, marginBottom: 8 },
  price: { ...typography.h4, color: colors.secondaryDark, marginBottom: spacing.lg },
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  buttonText: { color: colors.white, ...typography.button },
  backButton: { alignItems: 'center', paddingVertical: 10 },
  backButtonText: { color: colors.textSecondary },
});