// services/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'whereIs_items';

export const saveItem = async (item) => {
  try {
    // Get existing items
    const existingItemsJson = await AsyncStorage.getItem(STORAGE_KEY);
    let existingItems = existingItemsJson ? JSON.parse(existingItemsJson) : [];
    
    // Create a new item with a unique ID
    const newItem = {
      ...item,
      id: Date.now().toString(), // Simple unique ID
      createdAt: new Date().toISOString()
    };
    
    // Add new item to the array
    const updatedItems = [...existingItems, newItem];
    
    // Save back to storage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    
    return newItem;
  } catch (error) {
    console.error('Error saving item:', error);
    throw error;
  }
};

export const getAllItems = async () => {
  try {
    const itemsJson = await AsyncStorage.getItem(STORAGE_KEY);
    return itemsJson ? JSON.parse(itemsJson) : [];
  } catch (error) {
    console.error('Error getting items:', error);
    throw error;
  }
};

export const getItemById = async (id) => {
  try {
    const items = await getAllItems();
    return items.find(item => item.id === id) || null;
  } catch (error) {
    console.error('Error getting item by ID:', error);
    throw error;
  }
};

export const updateItem = async (updatedItem) => {
  try {
    const items = await getAllItems();
    const updatedItems = items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    return updatedItem;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

export const deleteItem = async (id) => {
  try {
    const items = await getAllItems();
    const filteredItems = items.filter(item => item.id !== id);
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredItems));
    return true;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};