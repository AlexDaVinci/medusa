// FormScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from "../context/AuthContext"; 
import axios from 'axios';

const FormScreen = () => {
  const { authData } = useAuth();
  console.log("Token de refresco:", authData.refreshToken)
  const [selectedValue, setSelectedValue] = useState('option1');
  const [inputValue, setInputValue] = useState('');
  const [textInputValue, setTextInputValue] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [imageName, setImageName] = useState('');
  const [incidentTypeOptions, setIncidentTypeOptions] = useState([]);

  useEffect(() => {
    // Realizar la solicitud HTTP para obtener las opciones del select
    axios
      .get("https://production.medusaapi.online/api/v1/modeloprobabilistico/Indicators", {
        headers: {
          Authorization: authData.refreshToken,
        },
      })
      .then((response) => {
        const optionsFromAPI = response.data.map((option) => ({
          label: option.name,
          value: option.id,
        }));
        setIncidentTypeOptions(optionsFromAPI);
      })
      .catch((error) => {
        console.error("Error al obtener las opciones del tipo de incidente:", error);
      });
  }, [authData.refreshToken]); 

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
  

  const handleSubmit = () => {
    // Aquí puedes implementar la lógica para enviar los datos del formulario
    console.log('Selected Value:', selectedValue);
    console.log('Input Value:', inputValue);
    console.log('Text Input Value:', textInputValue);
    console.log('Image URI:', imageUri);
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        style={styles.input}
      >
        {incidentTypeOptions.map((option) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
      
      <TextInput
        style={styles.input}
        placeholder="Input"
        value={inputValue}
        onChangeText={setInputValue}
      />

      <TextInput
        style={styles.textInput}
        placeholder="Texto"
        multiline
        value={textInputValue}
        onChangeText={setTextInputValue}
      />

      <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
        <Text style={styles.buttonText}>Seleccionar imagen</Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}

      <Button title="Enviar" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  textInput: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 100,
  },
  button: {
    width: '80%',
    padding: 15,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FormScreen;
