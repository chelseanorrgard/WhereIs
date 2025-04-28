import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';

const EntryScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image 
        source={require('../assets/where.png')} 
        style={styles.logo} 
      />

      {/* Add New Button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('RecordCreation')}
      >
        <Image source={require('../assets/add.png')} style={styles.buttonImage} />
      </TouchableOpacity>

      {/* List Items Button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('ListItems')}
      >
        <Image source={require('../assets/list.png')} style={styles.buttonImage} />
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#291528', // Dark background
  },
  logo: {
    width: 450,
    height: 450,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'transparent', // Remove button background
  },
  buttonImage: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
});

export default EntryScreen;