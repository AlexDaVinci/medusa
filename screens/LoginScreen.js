// LoginScreen.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {
  const { login } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://villavicencio.medusaapi.online/api/v1/auth/login",
        {
          email: email,
          password: password,
        }
      );
      login(response.data.data);
      navigation.navigate("Form");
    } catch (error) {
      console.error("Error en la solicitud de inicio de sesión:", error);
      alert("Credenciales no válidas");
    }
  };

  return (
    <LinearGradient
      colors={[
        "#020515",
        "#06091b",
        "#090c21",
        "#0c0f27",
        "#0d122d",
        "#10183c",
        "#161c4b",
        "#1d215b",
        "#2e2978",
        "#442e94",
        "#5f32b0",
        "#7d32ca",
      ]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={require("../assets/images/Proyecto.png")}
          style={styles.logo}
        />
        <Text style={styles.titleText}>Iniciar sesión</Text>
        <Text style={styles.textholder}>Email*</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#a9a9a9"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.textholder}>Contraseña*</Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#a9a9a9"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 100,
    alignSelf: "center", 
    marginBottom: 10,
  },
  titleText: {
    color: "white",
    fontSize: 24,
    marginBottom: 10,
    alignSelf: "center", 
  },
  textholder: {
    color: "white",
    fontSize: 16,
    marginBottom: 2,
  },
  content: {
    width: "90%", // Ajusta el ancho del contenido
    maxWidth: 300, // Máximo ancho permitido
    marginHorizontal: "auto", // Centra el contenido
  },
  input: {
    color: "white",
    fontSize: 14,
    backgroundColor: "#0f1535",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    width: "100%", // El botón ocupa todo el ancho disponible
    padding: 15,
    backgroundColor: "#0075ff",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
