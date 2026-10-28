import { useContext } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { UserContext } from '../../contexts/UserContext';
import { colors, typography, radius, spacing } from '../../theme';

export default function Perfil() {
  const router = useRouter();
  const { usuario, logout, cambiarFoto, eliminarFoto } = useContext(UserContext);

  const elegirDeGaleria = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para elegir una foto.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!res.canceled) await cambiarFoto(res.assets[0].uri);
  };

  const sacarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara para sacar una foto.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!res.canceled) await cambiarFoto(res.assets[0].uri);
  };

  const confirmarEliminarFoto = () =>
    Alert.alert(
      'Eliminar foto',
      '¿Querés quitar tu foto de perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: eliminarFoto },
      ],
    );

  const cambiarAvatar = () =>
    Alert.alert('Foto de perfil', 'Elegí una opción', [
      { text: 'Tomar foto', onPress: sacarFoto },
      { text: 'Elegir de galería', onPress: elegirDeGaleria },
      ...(usuario?.avatarUri ? [{ text: 'Eliminar foto', style: 'destructive', onPress: confirmarEliminarFoto }] : []),
      { text: 'Cancelar', style: 'cancel' },
    ]);

  if (usuario) {
    return (
      <View style={styles.container}>
        <Pressable onPress={cambiarAvatar} style={styles.avatarWrap}>
          {usuario.avatarUri ? (
            <Image source={{ uri: usuario.avatarUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarEmpty]}>
              <Ionicons name="person" size={48} color={colors.secondary} />
            </View>
          )}
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={16} color={colors.white} />
          </View>
        </Pressable>

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
  avatarWrap: { marginBottom: spacing.sm },
  avatar: { width: 110, height: 110, borderRadius: 55 },
  avatarEmpty: { backgroundColor: colors.secondaryLight, alignItems: 'center', justifyContent: 'center' },
  cameraBadge: {
    position: 'absolute', right: 0, bottom: 0,
    backgroundColor: colors.secondary, borderRadius: 14, padding: 6,
  },
  title: { ...typography.h3, color: colors.textPrimary },
  email: { color: colors.textSecondary, marginBottom: 8 },
  button: { backgroundColor: colors.secondary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: radius.md },
  buttonText: { color: colors.white, fontWeight: '600' },
  secondaryButton: { paddingVertical: 8 },
  secondaryButtonText: { color: colors.secondaryDark, textDecorationLine: 'underline' },
});