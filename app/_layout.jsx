import { Stack } from 'expo-router';
import { CartProvider } from '../contexts/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="producto/[id]" options={{ title: 'Detalle del producto' }} />
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="registro" options={{ title: 'Registro' }} />
        <Stack.Screen name="contacto" options={{ title: 'Contacto' }} />
      </Stack>
    </CartProvider>
  );
}