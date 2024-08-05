import React, { useState } from 'react';
import { View, Text, Button, Alert, Platform, PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';

const FileExample = () => {
  const [fileContent, setFileContent] = useState('');

  const internalDirectoryPath = RNFS.DocumentDirectoryPath;
  const newFolderPath = `${internalDirectoryPath}/MyNewFolder`;
  const filePath = `${newFolderPath}/example.txt`;

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        ]);
        if (
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissões de armazenamento concedidas');
        } else {
          console.log('Permissões de armazenamento negadas');
          Alert.alert('Permissões Necessárias', 'Por favor, conceda permissões de armazenamento para usar o aplicativo.');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const createFolder = async () => {
    await requestPermissions();
    try {
      await RNFS.mkdir(newFolderPath);
      Alert.alert('Pasta criada', `Pasta criada em: ${newFolderPath}`);
    } catch (err) {
      console.error(err.message);
      Alert.alert('Erro ao criar pasta', err.message);
    }
  };

  const writeFile = async () => {
    await requestPermissions();
    try {
      await RNFS.writeFile(filePath, 'Hello, React Native FS!', 'utf8');
      Alert.alert('Arquivo escrito', `Arquivo salvo em: ${filePath}`);
    } catch (err) {
      console.error(err.message);
      Alert.alert('Erro ao escrever no arquivo', err.message);
    }
  };

  const readFile = async () => {
    try {
      const content = await RNFS.readFile(filePath, 'utf8');
      setFileContent(content);
    } catch (err) {
      console.error(err.message);
      Alert.alert('Erro ao ler o arquivo', err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Criar Pasta" onPress={createFolder} />
      <Button title="Escrever no Arquivo" onPress={writeFile} />
      <Button title="Ler do Arquivo" onPress={readFile} />
      <Text style={{ marginTop: 20 }}>Conteúdo do arquivo: {fileContent}</Text>
    </View>
  );
};

export default FileExample;
