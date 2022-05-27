import { StyleSheet } from "react-native";
import { NotificationProvider } from "./src/provider/NotificationProvider";
import Navigate from "./src/routes/Navigate";

export default function App() {
  return (
    <NotificationProvider>
      <Navigate />
    </NotificationProvider>
  );
}

