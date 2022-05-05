import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLOR_STORAGE_KEY = '@color_Items';

type Color = {
  name: string,
  key: number
}

export default function App() {
  const [newColor, setNewColor] = useState("");
  const [colors, setColors] = useState<Color[]>([]);

  useEffect(() => {
    loadColors();
  }, []);

  useEffect(() => {
    updateColors();
    console.log(colors);
  }, [colors]);

  const getMaxKey = () : number => {
    let maxNumber: number = 0;
    colors.forEach(x => x.key > maxNumber ? maxNumber = x.key : null);
    return maxNumber
  }

  const addColor = () : void => {
    if (newColor != null && newColor != "") {
      setColors([...colors, { name: newColor, key: getMaxKey()+1 }]);
    }
  }
  const deleteColors = () : void => {
    setColors([]);
  }

  const loadColors = async () => {
    try {
      let storedColors = await AsyncStorage.getItem(COLOR_STORAGE_KEY);
      if (storedColors != null) {
        setColors(JSON.parse(storedColors));
      }
    } catch (e) {
      console.error("failed to load colors", e);
    }
  }

  const updateColors = async () => {
    try {
      let todoItemsToStore = JSON.stringify(colors);
      await AsyncStorage.setItem(COLOR_STORAGE_KEY, todoItemsToStore);
    } catch (e) {
      console.error("failed to store colors", e);
    }
  }

  return (
    <View style={styles.container}>
      <Text>new Color: {newColor}{'\n'}</Text>
      
      <Text style={styles.title}>all Colors:</Text>
      {colors.map(x => <Text>{x.name}</Text>)}
      <Text>{'\n'}</Text>
      <TextInput placeholder='please enter a text' onChangeText={(x) => setNewColor(x)} />
      <Button title="add color" onPress={addColor} />
      <Button title="delete all" onPress={deleteColors} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight : 'bold'
  }
});
