import LoginScreen from "./login";
import { initDB } from "./db/database";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    initDB();
  },[]); 
  return <LoginScreen/>;
}
