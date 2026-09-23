import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { colors, typography, radius, spacing } from '../theme';

export default function Contacto() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleEnviar = () => {
    if (!nombre || !email || !mensaje) {
      Alert.alert('Faltan datos', 'Completá todos los campos.');
      return;
    }
    Alert.alert('¡Gracias!', 'Recibimos tu mensaje, te vamos a responder a la brevedad.');
    setNombre('');
    setEmail('');
    setMensaje('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Contacto</Text>
      <Text style={styles.subtitle}>¿Tenés dudas o sugerencias? Escribinos.</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Tu mensaje"
        value={mensaje}
        onChangeText={setMensaje}
        multiline
        numberOfLines={5}
      />

      <Pressable style={styles.button} onPress={handleEnviar}>
        <Text style={styles.buttonText}>Enviar mensaje</Text>
      </Pressable>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Otros medios</Text>
        <Text style={styles.infoText}>📧 malena@gmail.com</Text>
        <Text style={styles.infoText}>📱 +54 9 376 000-0000</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, backgroundColor: colors.background, flexGrow: 1 },
  title: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },
  subtitle: { color: colors.textSecondary, marginBottom: spacing.lg },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#eee',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: { color: colors.white, ...typography.button },
  infoBox: {
    marginTop: spacing.xl,
    backgroundColor: colors.secondaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  infoTitle: { fontWeight: '700', color: colors.textPrimary, marginBottom: 6 },
  infoText: { color: colors.textPrimary, marginBottom: 2 },
});