import React, { useState, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions, 
  SafeAreaView, 
  TextInput, 
  FlatList, 
  Text 
} from 'react-native';
import { getAllItems } from '../services/storage';

const { width, height } = Dimensions.get('window');

const EntryScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const logoSize = Math.min(width * 0.7, height * 0.4, 300);
  const buttonWidth = Math.min(width * 0.6, 200);

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setShowSearchResults(false);
      setFilteredItems([]);
    } else {
      filterItems(searchQuery);
      setShowSearchResults(true);
    }
  }, [searchQuery, allItems]);

  const loadItems = async () => {
    try {
      const items = await getAllItems();
      setAllItems(items);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const filterItems = (query) => {
    const lowercaseQuery = query.toLowerCase().trim();
    const filtered = allItems.filter(item => 
      item.name.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredItems(filtered);
  };

  const handleItemPress = (itemId) => {
    navigation.navigate('ItemDetail', { itemId });
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity 
      style={styles.searchResultItem}
      onPress={() => handleItemPress(item.id)}
    >
      <View style={styles.searchResultContent}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
        ) : (
          <View style={styles.noThumbnail}>
            <Text style={styles.noThumbnailText}>No Image</Text>
          </View>
        )}
        <Text style={styles.searchResultName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {showSearchResults ? (
          <>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for items..."
                placeholderTextColor="#aaa"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
              />
            </View>

            {/* Search Results */}
            <View style={styles.searchResultsContainer}>
              <Text style={styles.searchResultsTitle}>
                Search Results ({filteredItems.length})
              </Text>
              <FlatList
                data={filteredItems}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id.toString()}
                style={styles.searchResultsList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={styles.noResultsText}>No items found</Text>
                }
              />
            </View>
          </>
        ) : (
          <>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/where.png')} 
                style={[styles.logo, { width: logoSize, height: logoSize }]} 
              />
            </View>

            {/* Search Bar (moved below logo) */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for items..."
                placeholderTextColor="#aaa"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
              />
            </View>

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('RecordCreation')}
              >
                <Image 
                  source={require('../assets/add.png')} 
                  style={[styles.buttonImage, { width: buttonWidth }]} 
                />
              </TouchableOpacity>

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
          </>
        )}
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  searchContainer: {
    marginBottom: 20,
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
  searchResultsContainer: {
    flex: 1,
  },
  searchResultsTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchResultsList: {
    flex: 1,
  },
  searchResultItem: {
    backgroundColor: '#3d2038',
    borderRadius: 8,
    marginBottom: 10,
    padding: 12,
  },
  searchResultContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
  },
  noThumbnail: {
    width: 50,
    height: 50,
    backgroundColor: '#291528',
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noThumbnailText: {
    color: '#aaa',
    fontSize: 10,
    textAlign: 'center',
  },
  searchResultName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  noResultsText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
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
    minHeight: 140,
  },
  button: {
    marginVertical: 8,
    padding: 5,
    backgroundColor: 'transparent',
  },
  buttonImage: {
    height: 60,
    resizeMode: 'contain',
  },
});

export default EntryScreen;
