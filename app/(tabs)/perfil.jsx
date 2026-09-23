import { useContext } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { CartContext } from '../../contexts/CartContext';
import { colors, typography, radius, spacing } from '../../theme';

export default function Perfil() {
  const router = useRouter();
  const { usuario, logout } = useContext(CartContext);

  if (usuario) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Hola, {usuario.nombre}</Text>
        <Text style={styles.email}>{usuario.email}</Text>
        <Pressable style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => router.push('/contacto')}>
          <Text style={styles.secondaryButtonText}>Contacto</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Pressable style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Ir a Login</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => router.push('/registro')}>
        <Text style={styles.buttonText}>Ir a Registro</Text>
      </Pressable>
      <Pressable style={styles.secondaryButton} onPress={() => router.push('/contacto')}>
        <Text style={styles.secondaryButtonText}>Contacto</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: colors.background },
  title: { ...typography.h3, color: colors.textPrimary },
  email: { color: colors.textSecondary, marginBottom: 8 },
  button: { backgroundColor: colors.secondary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: radius.md },
  buttonText: { color: colors.white, fontWeight: '600' },
  secondaryButton: { paddingVertical: 8 },
  secondaryButtonText: { color: colors.secondaryDark, textDecorationLine: 'underline' },
});