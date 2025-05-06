import React, { useState, useEffect } from 'react';
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
import { saveItem, getItemById, updateItem } from '../services/storage';

const RecordCreationScreen = ({ navigation, route }) => {
  // Check if we're in edit mode by looking for itemId in route params
  const { itemId } = route.params || {};
  const isEditMode = !!itemId;
  
  const [itemName, setItemName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [gpsLocation, setGpsLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  // If in edit mode, load the existing item data
  useEffect(() => {
    const loadItemData = async () => {
      if (isEditMode) {
        try {
          setInitialLoading(true);
          const item = await getItemById(itemId);
          
          if (item) {
            setItemName(item.name || '');
            setLocation(item.location || '');
            setDescription(item.description || '');
            setImage(item.imageUri || null);
            setGpsLocation(item.gpsLocation || null);
          } else {
            Alert.alert('Error', 'Item not found');
            navigation.goBack();
          }
        } catch (error) {
          console.error('Error loading item for edit:', error);
          Alert.alert('Error', 'Failed to load item data');
          navigation.goBack();
        } finally {
          setInitialLoading(false);
        }
      }
    };

    loadItemData();
  }, [itemId, isEditMode]);

  // Function to handle taking a photo
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera permission is needed to take a photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Something went wrong when trying to take a photo.');
    }
  };
  
  // Function to pick a photo from library
  const pickPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Media library permission is needed to pick a photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking photo:', error);
      Alert.alert('Error', 'Something went wrong when trying to pick a photo.');
    }
  };

  // Function to get GPS location
  const fetchGpsLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Location permission is needed to get your location.');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setGpsLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      Alert.alert('Success', 'Location captured successfully!');
    } catch (error) {
      console.error('Error fetching GPS location:', error);
      Alert.alert('Error', 'Could not fetch GPS location.');
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
      const itemData = {
        name: itemName.trim(),
        location: location.trim(),
        description: description.trim(),
        imageUri: image,
        gpsLocation: gpsLocation,
      };
      
      let result;
      
      if (isEditMode) {
        // Update existing item
        result = await updateItem({
          ...itemData,
          id: itemId, // Include the original ID for updating
        });
        
        Alert.alert(
          'Success', 
          'Item updated successfully',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('ItemDetail', { itemId })
            }
          ]
        );
      } else {
        // Save new item
        result = await saveItem(itemData);
        
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
      }
    } catch (error) {
      Alert.alert('Error', isEditMode ? 'Failed to update item' : 'Failed to save item');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to remove the current photo
  const removePhoto = () => {
    setImage(null);
  };

  if (initialLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading item data...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isEditMode ? 'Edit Item' : 'Add New Item'}</Text>
      
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
        <View style={styles.mediaButtonRow}>
          <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
            <Text style={styles.mediaButtonText}>Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.mediaButton} onPress={pickPhoto}>
            <Text style={styles.mediaButtonText}>Choose Photo</Text>
          </TouchableOpacity>
        </View>
        
        {image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removePhotoButton} onPress={removePhoto}>
              <Text style={styles.removePhotoText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* GPS Location */}
      <View style={styles.mediaContainer}>
        <TouchableOpacity 
          style={styles.mediaButton} 
          onPress={fetchGpsLocation}
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
  mediaButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  mediaButton: {
    backgroundColor: '#6a3b63',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  mediaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginTop: 10,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#ff6b81',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
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
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
  },
});

export default RecordCreationScreen;