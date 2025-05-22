import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Dimensions, SafeAreaView } from 'react-native';

const { width, height } = Dimensions.get('window');

const EntryScreen = ({ navigation }) => {
  // Calculate responsive sizes
  const logoSize = Math.min(width * 0.7, height * 0.4, 300);
  const buttonWidth = Math.min(width * 0.6, 200);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/where.png')} 
            style={[styles.logo, { width: logoSize, height: logoSize }]} 
          />
        </View>

        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          {/* Add New Button */}
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('RecordCreation')}
          >
            <Image 
              source={require('../assets/add.png')} 
              style={[styles.buttonImage, { width: buttonWidth }]} 
            />
          </TouchableOpacity>

          {/* List Items Button */}
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('ListItems')}
          >
            <Image 
              source={require('../assets/list.png')} 
              style={[styles.buttonImage, { width: buttonWidth }]} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#291528',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  logoContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: height * 0.5,
  },
  logo: {
    resizeMode: 'contain',
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: 140, // Ensure minimum space for buttons
  },
  button: {
    marginVertical: 8,
    padding: 5,
    backgroundColor: 'transparent',
  },
  buttonImage: {
    height: 60, // Fixed height, responsive width
    resizeMode: 'contain',
  },
});

export default EntryScreen;