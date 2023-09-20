// FormScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../context/AuthContext";
import { Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

const FormScreen = () => {
  const { authData } = useAuth();
  //console.log("Token de refresco:", authData.refreshToken)
  const [selectedValue, setSelectedValue] = useState("option1");
  const [inputValue, setInputValue] = useState("");
  const [textInputValue, setTextInputValue] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [imageName, setImageName] = useState("");
  const [incidentTypeOptions, setIncidentTypeOptions] = useState([]);
  const [pointCoordinates, setPointCoordinates] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Se requieren permisos de ubicación para enviar el informe.");
      return;
    }
  };

  useEffect(() => {
    requestLocationPermission();
    // Realizar la solicitud HTTP para obtener las opciones del select
    axios
      .get(
        "https://villavicencio.medusaapi.online/api/v1/modeloprobabilistico/Indicators",
        {
          headers: {
            Authorization: authData.refreshToken,
          },
        }
      )
      .then((response) => {
        const optionsFromAPI = response.data.map((option) => ({
          label: option.name,
          value: option.id,
        }));
        setIncidentTypeOptions(optionsFromAPI);
      })
      .catch((error) => {
        console.error(
          "Error al obtener las opciones del tipo de incidente:",
          error
        );
      });
  }, [authData.refreshToken]);

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permiso para acceder a la cámara es necesario");
      return;
    }

    try {
      await Location.requestForegroundPermissionsAsync();
      const location = await Location.getCurrentPositionAsync({});
      //// Ocultar mensaje de carga una vez que se obtiene la ubicación
      if (location) {
        const { latitude, longitude } = location.coords;
        console.log("Latitude: ", latitude);
        console.log("Longitude: ", longitude);
        setPointCoordinates(`${longitude}, ${latitude}`);
        console.log("Coordenadas:", pointCoordinates);
      }
    } catch (error) {
      console.error("Error obteniendo ubicación:", error);
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageNames = result.assets[0].uri.split("/").pop();
      if (imageNames) {
        const imageType = imageName.split(".").pop();
        const imageFile = {
          uri: result.assets[0].uri,
          name: imageNames,
          type: "image/" + imageType,
        };
        console.log("Imagen capturada:", imageFile);
        setImageUri(result.assets[0].uri);
        setImageName(imageNames);
      }
    }
  };

  const handleSubmit = async () => {
    setLoadingLocation(true);
    try {
      console.log("Coordenadas2:", pointCoordinates);
      const formData = new FormData();
      formData.append("IndicatorId", selectedValue); // Cambiado a selectedValue
      formData.append("address", inputValue);
      formData.append("description", textInputValue);
      formData.append("image", {
        uri: imageUri,
        name: imageName,
        type: "image/jpeg", // Ajusta el tipo de imagen según corresponda
      });
      formData.append("pointCoordinates", pointCoordinates); // Cambia a la coordenada real

      const response = await axios.post(
        "https://villavicencio.medusaapi.online/api/v1/incident/store",
        formData,
        {
          headers: {
            Authorization: authData.refreshToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response from server:", response.data);
      setLoadingLocation(false);
      Alert.alert("Éxito", "Se ha enviado el reporte", [
        {
          text: "Ok",
          onPress: () => {
            // Resetear los valores
            setSelectedValue("option1");
            setInputValue("");
            setTextInputValue("");
            setImageUri("");
            setImageName("");
          },
          style: "cancel",
        },
      ]);
      // Aquí puedes realizar cualquier acción adicional después de enviar los datos
    } catch (error) {
      setLoadingLocation(false);
      Alert.alert("Error", "Ocurrió un error al enviar el reporte", [
        {
          text: "Ok",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]);
      console.error("Error al enviar los datos:", error);
      // Aquí puedes manejar el error de alguna manera
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
      <Image
        source={require("../assets/images/Proyecto.png")}
        style={styles.logo}
      />
      <View style={styles.contentForm}>
        {/* Mostrar un mensaje de carga si se está obteniendo la ubicación */}
        {loadingLocation && <ActivityIndicator size="large" color="purple" />}
        <Text style={styles.textholder}>Tipo de Incidente*</Text>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
          style={[styles.input, styles.picker]}
          itemStyle={{ fontSize: 14, color: "white" }} // Ajustar el tamaño del texto y color
          dropdownIconColor="white" // Color del ícono desplegable
        >
          {incidentTypeOptions.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>

        <Text style={styles.textholder}>Dirección*</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#a9a9a9"
          placeholder="Ingrese la dirección"
          value={inputValue}
          onChangeText={setInputValue}
        />

        <Text style={styles.textholder}>Descripción*</Text>
        <TextInput
          style={styles.textInput}
          placeholderTextColor="#a9a9a9"
          placeholder="Ingrese la descripción"
          multiline
          value={textInputValue}
          onChangeText={setTextInputValue}
        />
        <Text style={styles.textholder}>Fotografia*</Text>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{
              width: 200,
              height: 200,
              borderRadius: 10,
              alignSelf: "center",
              marginBottom: 10,
              marginTop: 10,
            }}
          />
        ) : (
          <Image
            source={require("../assets/images/splash.png")}
            style={{
              width: 200,
              height: 200,
              borderRadius: 10,
              alignSelf: "center",
              marginBottom: 10,
              marginTop: 10,
            }}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
          <Text style={styles.buttonText}>Tomar foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enviar</Text>
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
  picker: {
    height: 50,
    color: "white",
    backgroundColor: "#0f1535",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    marginBottom: 10,
    overflow: "hidden",
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
  label: {
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginBottom: 5,
    fontWeight: "bold",
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
  textInput: {
    color: "white",
    fontSize: 14,
    backgroundColor: "#0f1535",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 100,
  },
  content: {
    width: "90%", // Ajusta el ancho del contenido
    maxWidth: 300, // Máximo ancho permitido
    marginHorizontal: "auto", // Centra el contenido
  },
  contentForm: {
    padding: 15,
    width: "90%", // Ajusta el ancho del contenido
    maxWidth: 300,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 5,
  },
  button: {
    width: "200", // El botón ocupa todo el ancho disponible
    padding: 15,
    backgroundColor: "#0075ff",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FormScreen;
