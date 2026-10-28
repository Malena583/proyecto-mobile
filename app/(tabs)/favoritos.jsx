import React, { useCallback, useContext } from 'react';
import {
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import SwipeRow from '../../components/SwipeRow';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import { colors, radius, spacing } from '../../theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ROW_HEIGHT = 84;

const renderPrice = (price) => {
  if (price == null) return '';
  const num = Number(price);
  return isNaN(num) ? String(price) : `$${num.toFixed(2)}`;
};

const FavoriteItem = React.memo(function FavoriteItem({
  item,
  index,
  total,
  onMove,
  onDelete,
  onPressItem,
}) {
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const dragGesture = Gesture.Pan()
    .activateAfterLongPress(150)
    .onStart(() => {
      'worklet';
      isDragging.value = true;
    })
    .onUpdate((e) => {
      'worklet';
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      'worklet';
      isDragging.value = false;
      const delta = Math.round(e.translationY / ROW_HEIGHT);
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      if (delta !== 0) {
        runOnJS(onMove)(index, index + delta);
      }
    })
    .onFinalize(() => {
      'worklet';
      isDragging.value = false;
      translateY.value = 0;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: isDragging.value ? 1.03 : 1 },
      ],
      zIndex: isDragging.value ? 999 : 1,
      elevation: isDragging.value ? 10 : 2,
      shadowOpacity: isDragging.value ? 0.3 : 0.08,
      shadowRadius: isDragging.value ? 10 : 4,
      shadowOffset: { width: 0, height: isDragging.value ? 6 : 2 },
    };
  });

  return (
    <Animated.View style={[styles.row, animatedStyle]}>
      {/* Zona de swipe: el producto */}
      <View style={styles.swipeZone}>
        <SwipeRow onDelete={(cerrar) => onDelete(item, cerrar)}>
          <Pressable style={styles.item} onPress={() => onPressItem(item.id)}>
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
            <View style={styles.info}>
              <Text style={styles.category}>{item.category ?? ''}</Text>
              <Text style={styles.title} numberOfLines={2}>
                {item.title ?? ''}
              </Text>
              <Text style={styles.price}>{renderPrice(item.price)}</Text>
            </View>
          </Pressable>
        </SwipeRow>
      </View>

      {/* Zona de reordenamiento */}
      <View style={styles.handleContainer}>
        <Pressable
          hitSlop={8}
          disabled={index === 0}
          onPress={() => onMove(index, index - 1)}
          style={[styles.arrowButton, index === 0 && styles.disabledArrow]}
        >
          <Ionicons
            name="chevron-up"
            size={16}
            color={index === 0 ? colors.border ?? '#ccc' : colors.textSecondary}
          />
        </Pressable>

        <GestureDetector gesture={dragGesture}>
          <View style={styles.dragHandle}>
            <Ionicons name="reorder-three" size={26} color={colors.textSecondary} />
          </View>
        </GestureDetector>

        <Pressable
          hitSlop={8}
          disabled={index === total - 1}
          onPress={() => onMove(index, index + 1)}
          style={[styles.arrowButton, index === total - 1 && styles.disabledArrow]}
        >
          <Ionicons
            name="chevron-down"
            size={16}
            color={index === total - 1 ? colors.border ?? '#ccc' : colors.textSecondary}
          />
        </Pressable>
      </View>
    </Animated.View>
  );
});

export default function Favoritos() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { favoritos, listo, quitarFavorito, reordenarFavoritos } = useContext(FavoritesContext);

  const moverItem = useCallback(
    (fromIndex, toIndex) => {
      if (fromIndex == null || toIndex == null || fromIndex === toIndex) return;
      const target = Math.max(0, Math.min(favoritos.length - 1, toIndex));
      if (target === fromIndex) return;

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const updated = [...favoritos];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(target, 0, moved);
      reordenarFavoritos(updated);
    },
    [favoritos, reordenarFavoritos]
  );

  const confirmarEliminar = useCallback(
    (item, cerrar) => {
      Alert.alert(
        'Eliminar favorito',
        '¿Querés quitarlo de favoritos?',
        [
          { text: 'Cancelar', style: 'cancel', onPress: () => cerrar?.() },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => {
              cerrar?.();
              setTimeout(() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                quitarFavorito(item.id);
              }, 120);
            },
          },
        ],
        { cancelable: true, onDismiss: () => cerrar?.() }
      );
    },
    [quitarFavorito]
  );

  const onPressItem = useCallback(
    (id) => {
      router.push(`/producto/${id}`);
    },
    [router]
  );

  if (!listo) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={styles.loadingText}>Cargando favoritos...</Text>
      </View>
    );
  }

  if (favoritos.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="heart-outline" size={48} color={colors.secondaryLight} />
        <Text style={styles.emptyText}>Todavía no tenés favoritos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>Deslizá para eliminar · arrastrá ≡ o usá ▲▼ para ordenar</Text>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        renderItem={({ item, index }) => (
          <FavoriteItem
            item={item}
            index={index}
            total={favoritos.length}
            onMove={moverItem}
            onDelete={confirmarEliminar}
            onPressItem={onPressItem}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hint: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 12,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  listContent: { padding: spacing.md },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.background,
  },
  emptyText: { color: colors.textSecondary, fontSize: 16 },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.background,
  },
  loadingText: { color: colors.textSecondary, fontSize: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  swipeZone: { flex: 1 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.sm,
  },
  image: { width: 60, height: 60, marginRight: spacing.sm, backgroundColor: colors.white },
  info: { flex: 1 },
  category: { color: colors.textSecondary, fontSize: 12 },
  title: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  price: { fontSize: 13, color: colors.secondaryDark, marginTop: 2 },
  handleContainer: {
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#f0f0f0',
  },
  dragHandle: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButton: {
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledArrow: {
    opacity: 0.3,
  },
});
