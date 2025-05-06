import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EntryScreen from './screens/EntryScreen';
import ListItemsScreen from './screens/ListItemsScreen';
import RecordCreationScreen from './screens/RecordCreationScreen';
import ItemDetailScreen from './screens/ItemDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Entry"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#291528',
          },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen 
          name="Entry" 
          component={EntryScreen} 
          options={{ title: 'Where the #?@% Is' }} 
        />
        <Stack.Screen 
          name="ListItems" 
          component={ListItemsScreen} 
          options={{ title: 'My Items' }} 
        />
        <Stack.Screen 
          name="RecordCreation" 
          component={RecordCreationScreen} 
          options={{ title: 'Add New Item' }} 
        />
        <Stack.Screen 
          name="ItemDetail" 
          component={ItemDetailScreen} 
          options={{ title: 'Item Details' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}