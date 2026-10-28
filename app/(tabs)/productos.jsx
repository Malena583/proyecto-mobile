import { useMemo, useState } from 'react';
import {
  ActivityIndicator, FlatList, Pressable, RefreshControl,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProductCard from '../../components/ProductCard';
import { useFetch } from '../../hooks/useFetch';
import { API_URL } from '../../constants/api';
import { colors, radius, spacing } from '../../theme';

export default function Productos() {
  const insets = useSafeAreaInsets();
  const { data, loading, error, refetch } = useFetch(API_URL);
  const [busqueda, setBusqueda] = useState('');

  const productos = useMemo(() => {
    const lista = data ?? [];
    const q = busqueda.trim().toLowerCase();
    if (!q) return lista;
    return lista.filter(
      (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [data, busqueda]);

  // Spinner a pantalla completa solo en la primera carga
  if (loading && !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={productos}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      renderItem={({ item }) => <ProductCard product={item} />}
      contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.xl }]}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={refetch}
          colors={[colors.secondary]}
          tintColor={colors.secondary}
        />
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Nuestro Catálogo</Text>
          <TextInput
            style={styles.search}
            placeholder="Buscar productos..."
            value={busqueda}
            onChangeText={setBusqueda}
            autoCorrect={false}
          />
        </View>
      }
      ListEmptyComponent={<Text style={styles.empty}>No hay productos disponibles.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md },
  header: { marginBottom: spacing.md },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.sm },
  search: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.secondaryLight,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: 12,
  },
  errorText: { color: colors.textSecondary },
  retryButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radius.md,
  },
  retryText: { color: colors.white, fontWeight: '600' },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: spacing.lg },
});