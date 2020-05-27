import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './Screens/HomeScreen';
import ChangeBgOnImageScreen from './Screens/ChangeBgOnImageScreen';
import MemoViewScreen from './Screens/MemoViewScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Home'}}
        />
        <Stack.Screen name="ChangeBgOnImage" component={ChangeBgOnImageScreen} options={{title: 'Capture Image'}}/>
        <Stack.Screen name="MemoView" component={MemoViewScreen} options={{title: 'Background Image Effects'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
