import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import products from '../../data/products.json';
import { colors, typography, radius, spacing } from '../../theme';

export default function Home() {
  const router = useRouter();
  const destacados = products.slice(0, 3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Bienvenido</Text>
        <Text style={styles.heroSubtitle}>
          Descubrí lo nuevo de la temporada
        </Text>
        <Pressable style={styles.ctaButton} onPress={() => router.push('/productos')}>
          <Text style={styles.ctaText}>Ver catálogo completo</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Destacados</Text>

      {destacados.map((product) => (
        <Pressable
          key={product.id}
          style={styles.card}
          onPress={() => router.push(`/producto/${product.id}`)}
        >
          <Image source={{ uri: product.image }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.category}>{product.category}</Text>
            <Text style={styles.title} numberOfLines={1}>{product.title}</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  hero: {
    backgroundColor: colors.secondaryLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  heroTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: 4 },
  heroSubtitle: { color: colors.textSecondary, marginBottom: spacing.md },
  ctaButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  ctaText: { color: colors.white, ...typography.button },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  image: { width: 80, height: 80 },
  info: { flex: 1, padding: spacing.sm, justifyContent: 'center' },
  category: { color: colors.textSecondary, fontSize: 12 },
  title: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginVertical: 2 },
  price: { color: colors.secondaryDark, fontWeight: '700' },
});