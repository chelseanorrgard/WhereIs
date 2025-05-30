import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import EntryScreen from './screens/EntryScreen';
import ListItemsScreen from './screens/ListItemsScreen';
import RecordCreationScreen from './screens/RecordCreationScreen';
import ItemDetailScreen from './screens/ItemDetailScreen';

const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync();

const CustomHeader = ({ title, navigation, route }) => {
  const currentRouteName = route.name;
  
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      {currentRouteName !== 'Entry' && (
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Entry')}
          >
            <Text style={styles.headerButtonText}>Home</Text>
          </TouchableOpacity>
          {currentRouteName !== 'ListItems' && (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.navigate('ListItems')}
            >
              <Text style={styles.headerButtonText}>List</Text>
            </TouchableOpacity>
          )}
          {currentRouteName !== 'RecordCreation' && (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.navigate('RecordCreation')}
            >
              <Text style={styles.headerButtonText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.splashContainer}>
        <Image 
          source={require('./assets/splash-icon.png')} 
          style={styles.splashIcon}
          resizeMode="contain"
        />
        <Text style={styles.splashText}>by Chelsea Norrgård</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Entry"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#291528',
            height: 80,
          },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen 
          name="Entry" 
          component={EntryScreen} 
          options={({ navigation, route }) => ({
            headerTitle: () => (
              <CustomHeader 
                title="Where the #?@% Is" 
                navigation={navigation} 
                route={route}
              />
            ),
          })}
        />
        <Stack.Screen 
          name="ListItems" 
          component={ListItemsScreen} 
          options={({ navigation, route }) => ({
            headerTitle: () => (
              <CustomHeader 
                title="My Items" 
                navigation={navigation} 
                route={route}
              />
            ),
          })}
        />
        <Stack.Screen 
          name="RecordCreation" 
          component={RecordCreationScreen} 
          options={({ navigation, route }) => ({
            headerTitle: () => (
              <CustomHeader 
                title={route.params?.itemId ? 'Edit Item' : 'Add New Item'}
                navigation={navigation} 
                route={route}
              />
            ),
          })}
        />
        <Stack.Screen 
          name="ItemDetail" 
          component={ItemDetailScreen} 
          options={({ navigation, route }) => ({
            headerTitle: () => (
              <CustomHeader 
                title="Item Details" 
                navigation={navigation} 
                route={route}
              />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    backgroundColor: '#6a3b63',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 6,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashIcon: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  splashText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    fontFamily: 'System',
  },
});