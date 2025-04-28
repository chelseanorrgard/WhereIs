import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { saveItem } from '../services/storage';

const RecordCreationScreen = ({ navigation }) => {
  const [itemName, setItemName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [gpsLocation, setGpsLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Request permission and take a photo
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Get current GPS location
  const getGpsLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Location permission is required to store GPS coordinates');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setGpsLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      Alert.alert('Success', 'GPS location captured');
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validate mandatory fields
    if (itemName.trim() === '' || description.trim() === '') {
      Alert.alert('Error', 'Item name and description are required');
      return;
    }
    
    try {
      setLoading(true);
      
      // Create the item object
      const newItem = {
        name: itemName.trim(),
        location: location.trim(),
        description: description.trim(),
        imageUri: image,
        gpsLocation: gpsLocation,
      };
      
      // Save to local storage
      await saveItem(newItem);
      
      Alert.alert(
        'Success', 
        'Item saved successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save item');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Item</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Item Name *</Text>
        <TextInput
          style={styles.input}
          value={itemName}
          onChangeText={setItemName}
          placeholder="Enter item name"
          placeholderTextColor="#aaa"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Where is it located?"
          placeholderTextColor="#aaa"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add details about the item and its location"
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={4}
        />
      </View>
      
      {/* Image Picker */}
      <View style={styles.mediaContainer}>
        <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
          <Text style={styles.mediaButtonText}>Take Photo</Text>
        </TouchableOpacity>
        
        {image && (
          <Image source={{ uri: image }} style={styles.previewImage} />
        )}
      </View>
      
      {/* GPS Location */}
      <View style={styles.mediaContainer}>
        <TouchableOpacity 
          style={styles.mediaButton} 
          onPress={getGpsLocation}
          disabled={loading}
        >
          <Text style={styles.mediaButtonText}>
            {gpsLocation ? 'Update Location' : 'Get GPS Location'}
          </Text>
        </TouchableOpacity>
        
        {gpsLocation && (
          <Text style={styles.locationText}>
            Location captured: {gpsLocation.latitude.toFixed(4)}, {gpsLocation.longitude.toFixed(4)}
          </Text>
        )}
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Image 
            source={require('../assets/save.png')} 
            style={styles.buttonImage} 
          />
        </TouchableOpacity>
      )}
      
      <Text style={styles.requiredNote}>* Required fields</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#291528',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#3d2038',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  mediaContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  mediaButton: {
    backgroundColor: '#6a3b63',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  mediaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  locationText: {
    color: '#ffffff',
    marginTop: 5,
  },
  saveButton: {
    alignSelf: 'center',
    marginTop: 20,
    padding: 10,
  },
  buttonImage: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
  },
  loader: {
    marginTop: 20,
  },
  requiredNote: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default RecordCreationScreen;