import { useRef } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { colors, radius } from '../theme';

// onDelete recibe una función "cerrar" para volver la fila a su lugar si se cancela
export default function SwipeRow({ children, onDelete }) {
  const swipeableRef = useRef(null);

  const handlePressDelete = () => {
    onDelete(() => {
      swipeableRef.current?.close();
    });
  };

  return (
    <Swipeable
      ref={swipeableRef}
      overshootRight={false}
      rightThreshold={40}
      renderRightActions={() => (
        <Pressable
          style={styles.action}
          onPress={handlePressDelete}
        >
          <Ionicons name="trash-outline" size={22} color={colors.white} />
          <Text style={styles.text}>Eliminar</Text>
        </Pressable>
      )}
    >
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  action: {
    backgroundColor: '#B42336',
    justifyContent: 'center',
    alignItems: 'center',
    width: 84,
    borderTopRightRadius: radius.md,
    borderBottomRightRadius: radius.md,
  },
  text: { color: colors.white, fontSize: 12, fontWeight: '600', marginTop: 2 },
});
