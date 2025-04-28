import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  Image,
  ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllItems } from '../services/storage';

const ListItemsScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reload data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadItems();
      return () => {}; // cleanup function
    }, [])
  );

  const loadItems = async () => {
    try {
      setLoading(true);
      const storedItems = await getAllItems();
      setItems(storedItems);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
    >
      <View style={styles.itemContent}>
        <View style={styles.textContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemLocation}>{item.location || 'No location specified'}</Text>
        </View>
        
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Where Is My Stuff?</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
      ) : items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No items found</Text>
          <Text style={styles.emptySubText}>Add new items using the button below</Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('RecordCreation')}
      >
        <Text style={styles.addButtonText}>+ Add New Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#291528',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 80, // Space for the Add button
  },
  itemContainer: {
    backgroundColor: '#3d2038',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 16,
    color: '#cccccc',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: '#4d304a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#aaaaaa',
    fontSize: 10,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6a3b63',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubText: {
    color: '#aaaaaa',
    fontSize: 16,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default ListItemsScreen;