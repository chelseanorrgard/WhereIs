import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllItems } from '../services/storage';

const ListItemsScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load items when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadItems();
    }, [])
  );

  // Filter items whenever search query or items change
  useEffect(() => {
    filterItems();
  }, [searchQuery, items]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const allItems = await getAllItems();
      setItems(allItems);
    } catch (error) {
      console.error('Error loading items:', error);
      Alert.alert('Error', 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    if (searchQuery.trim() === '') {
      setFilteredItems(items);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase().trim();
      const filtered = items.filter(item => 
        item.name.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredItems(filtered);
    }
  };

  const handleItemPress = (itemId) => {
    // Dismiss keyboard first, then navigate
    Keyboard.dismiss();
    // Use setTimeout to ensure keyboard dismissal completes before navigation
    setTimeout(() => {
      navigation.navigate('ItemDetail', { itemId });
    }, 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => handleItemPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        {/* Thumbnail */}
        <View style={styles.thumbnailContainer}>
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
          ) : (
            <View style={styles.noThumbnail}>
              <Text style={styles.noThumbnailText}>No Image</Text>
            </View>
          )}
        </View>

        {/* Item Details */}
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.location && (
            <Text style={styles.itemLocation}>{item.location}</Text>
          )}
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
          {item.createdAt && (
            <Text style={styles.itemDate}>
              Created: {formatDate(item.createdAt)}
            </Text>
          )}
        </View>

        {/* Arrow indicator */}
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading items...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.content}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search items by name..."
              placeholderTextColor="#aaa"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              blurOnSubmit={false}
            />
          </View>

          {/* Results Count */}
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {searchQuery.trim() !== '' 
                ? `${filteredItems.length} result${filteredItems.length !== 1 ? 's' : ''} found`
                : `${items.length} total item${items.length !== 1 ? 's' : ''}`
              }
            </Text>
          </View>

          {/* Items List */}
          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery.trim() !== '' 
                    ? 'No items found matching your search'
                    : 'No items saved yet'
                  }
                </Text>
                {searchQuery.trim() === '' && (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('RecordCreation')}
                  >
                    <Text style={styles.addButtonText}>Add Your First Item</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#291528',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#3d2038',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#6a3b63',
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsCount: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: '#3d2038',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnailContainer: {
    marginRight: 16,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  noThumbnail: {
    width: 60,
    height: 60,
    backgroundColor: '#291528',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noThumbnailText: {
    color: '#aaa',
    fontSize: 10,
    textAlign: 'center',
  },
  itemDetails: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 14,
    color: '#6a3b63',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: '#aaa',
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 24,
    color: '#6a3b63',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#6936d4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
  },
});

export default ListItemsScreen;