import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { UserProvider } from '../contexts/UserContext';
import { CartProvider } from '../contexts/CartContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <CartProvider>
          <FavoritesProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="producto/[id]" options={{ title: 'Detalle del producto' }} />
              <Stack.Screen name="login" options={{ title: 'Login' }} />
              <Stack.Screen name="registro" options={{ title: 'Registro' }} />
              <Stack.Screen name="contacto" options={{ title: 'Contacto' }} />
            </Stack>
          </FavoritesProvider>
        </CartProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
