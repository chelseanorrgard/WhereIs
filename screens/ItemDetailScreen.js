import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator
} from 'react-native';
import { getItemById, deleteItem } from '../services/storage';

const ItemDetailScreen = ({ route, navigation }) => {
  const { itemId } = route.params;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set the navigation title dynamically when item loads
  useEffect(() => {
    if (item) {
      navigation.setOptions({
        title: item.name,
      });
    }
  }, [item, navigation]);

  useEffect(() => {
    loadItem();
  }, [itemId]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const fetchedItem = await getItemById(itemId);
      if (fetchedItem) {
        setItem(fetchedItem);
      } else {
        Alert.alert('Error', 'Item not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading item:', error);
      Alert.alert('Error', 'Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(itemId);
              Alert.alert('Success', 'Item deleted successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item');
            }
          }
        }
      ]
    );
  };

  const handleEdit = () => {
    // Navigate to RecordCreation screen with the itemId parameter
    navigation.navigate('RecordCreation', { itemId: itemId });
  };

  const openMap = () => {
    if (item?.gpsLocation) {
      const { latitude, longitude } = item.gpsLocation;
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(url);
    } else {
      Alert.alert('No Location', 'No GPS coordinates available for this item');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Item not found</Text>
      </View>
    );
  }

  // Format the dates if available
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{item.name}</Text>
      
      {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} style={styles.image} />
      ) : (
        <View style={styles.noImage}>
          <Text style={styles.noImageText}>No Image Available</Text>
        </View>
      )}
      
      <View style={styles.detailsContainer}>
        {item.location && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{item.location}</Text>
          </View>
        )}
      
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Description:</Text>
          <Text style={styles.detailValue}>{item.description}</Text>
        </View>

        {item.createdAt && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created:</Text>
            <Text style={styles.detailValue}>{formatDate(item.createdAt)}</Text>
          </View>
        )}

        {item.updatedAt && item.updatedAt !== item.createdAt && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last Updated:</Text>
            <Text style={styles.detailValue}>{formatDate(item.updatedAt)}</Text>
          </View>
        )}
      </View>

      {item.gpsLocation && (
        <View style={styles.gpsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>GPS Location:</Text>
            <Text style={styles.detailValue}>
              {item.gpsLocation.latitude.toFixed(6)}, {item.gpsLocation.longitude.toFixed(6)}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.mapButton} onPress={openMap}>
            <Text style={styles.buttonText}>View on Map</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEdit}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#291528',
    padding: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 20,
  },
  noImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#3d2038',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  noImageText: {
    color: '#aaaaaa',
    fontSize: 16,
  },
  detailsContainer: {
    backgroundColor: '#3d2038',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  gpsContainer: {
    backgroundColor: '#3d2038',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#cccccc',
  },
  mapButton: {
    backgroundColor: '#6a3b63',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#6936d4',
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#ff6b81',
    marginLeft: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default ItemDetailScreen;