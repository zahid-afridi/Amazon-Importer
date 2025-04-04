import App from "./App";
import { createRoot } from "react-dom/client";
import { initI18n } from "./utils/i18nUtils";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/Store";
import { PersistGate } from 'redux-persist/integration/react';
import { AppBridgeProvider } from "./components"; // Import AppBridgeProvider
import { BrowserRouter } from "react-router-dom";

// Ensure that locales are loaded before rendering the app
initI18n().then(() => {
  const root = createRoot(document.getElementById("app"));
  root.render(
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <AppBridgeProvider> {/* Wrapping App with AppBridgeProvider */}
            <Toaster />
            <App />
          </AppBridgeProvider>
        </BrowserRouter>
        </PersistGate>
      </Provider>
    </>
  );
});
