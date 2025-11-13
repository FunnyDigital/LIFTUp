import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaystackProvider } from 'react-native-paystack-webview';

import { store } from '@/store';
import Navigation from '@/navigation';
import { ThemeProvider } from '@/constants/theme';
import { paymentService } from '@/services/paymentService';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaystackProvider publicKey={paymentService.getPaystackPublicKey()}>
            <ThemeProvider>
              <Navigation />
              <StatusBar style="light" backgroundColor="#000000" />
            </ThemeProvider>
          </PaystackProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}