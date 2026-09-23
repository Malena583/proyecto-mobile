import { FlatList, StyleSheet, Text, View } from 'react-native';
import products from '../../data/products.json';
import ProductCard from '../../components/ProductCard';
import { colors, spacing } from '../../theme';

export default function Productos() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuestro Catálogo</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        renderItem={({ item }) => <ProductCard product={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.md },
  list: { paddingBottom: spacing.xl },
});