import { useContext } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CartContext } from '../../contexts/CartContext';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import { useFetch } from '../../hooks/useFetch';
import { API_URL } from '../../constants/api';
import { colors, typography, radius, spacing } from '../../theme';

export default function DetalleProducto() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { agregarProducto } = useContext(CartContext);
  const { esFavorito, alternarFavorito, listo } = useContext(FavoritesContext);
  const { data: product, loading, error, refetch } = useFetch(`${API_URL}/${id}`);

  if (loading && !product) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>{error ?? 'Producto no encontrado'}</Text>
        <Pressable style={styles.button} onPress={refetch}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

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
    const respuesta = agregarProducto(product);
    if (!respuesta.success) {
      Alert.alert('Atención', respuesta.message, [
        { text: 'OK', onPress: () => router.push('/registro') },
      ]);
      return;
    }
    router.push('/(tabs)/carrito');
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + spacing.md }]}
    >
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      {product.description ? <Text style={styles.description}>{product.description}</Text> : null}

      <Pressable style={styles.buyButton} onPress={handleComprar}>
        <Text style={styles.buyButtonText}>Comprar ahora</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleAgregar}>
        <Text style={styles.buttonText}>Agregar al carrito</Text>
      </Pressable>

      <Pressable
        style={styles.favButton}
        onPress={() => { if (!cargando) alternarFavorito(product); }}
        disabled={cargando}
      >
        <Ionicons
          name={fav ? 'heart' : 'heart-outline'}
          size={20}
          color={cargando ? colors.textSecondary : colors.secondaryDark}
          opacity={cargando ? 0.5 : 1}
        />
        <Text style={[styles.favText, { opacity: cargando ? 0.5 : 1 }]}>
          {fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        </Text>
      </Pressable>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Volver</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, backgroundColor: colors.background, flexGrow: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
  },
  category: { color: colors.textSecondary, fontSize: 13, marginBottom: 4 },
  title: { ...typography.h3, color: colors.textPrimary, marginBottom: 8 },
  price: { ...typography.h4, color: colors.secondaryDark, marginBottom: spacing.sm },
  description: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  buyButton: {
    backgroundColor: colors.secondaryDark,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  buyButtonText: { color: colors.white, ...typography.button },
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  buttonText: { color: colors.white, ...typography.button },
  favButton: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  favText: { color: colors.secondaryDark, fontWeight: '600' },
  backButton: { alignItems: 'center', paddingVertical: 10 },
  backButtonText: { color: colors.textSecondary },
});