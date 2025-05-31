import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';

const STORAGE_KEY = 'whereIs_items';
const BACKUP_FILE = FileSystem.documentDirectory + 'whereIs_backup.json';

/**
 * Saves a new item to storage with data integrity checks
 * @param {Object} item - The item to save
 * @returns {Promise<Object>} The saved item with ID
 */
export const saveItem = async (item) => {
  try {
    if (!item.name || !item.description) {
      throw new Error('Item name and description are required');
    }
    
    const existingItems = await getAllItems();
    
    const newItem = {
      ...item,
      id: generateUniqueId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    if (newItem.imageUri) {
      const permanentUri = await ensurePermanentImage(newItem.imageUri);
      newItem.imageUri = permanentUri;
    }
    
    const updatedItems = [...existingItems, newItem];
    
    await saveItemsWithVerification(updatedItems);
    
    await createBackup(updatedItems);
    
    return newItem;
  } catch (error) {
    console.error('Error saving item:', error);
    throw error;
  }
};

/**
 * Retrieves all stored items
 * @returns {Promise<Array>} Array of all items
 */
export const getAllItems = async () => {
  try {
    const itemsJson = await SecureStore.getItemAsync(STORAGE_KEY);
    
    if (!itemsJson) {
      return await restoreFromBackup() || [];
    }
    
    return JSON.parse(itemsJson) || [];
  } catch (error) {
    console.error('Error getting items:', error);
    const backupItems = await restoreFromBackup();
    if (backupItems) {
      return backupItems;
    }
    throw error;
  }
};

/**
 * Retrieves a single item by ID
 * @param {string} id - The ID of the item to retrieve
 * @returns {Promise<Object|null>} The found item or null
 */
export const getItemById = async (id) => {
  try {
    const items = await getAllItems();
    return items.find(item => item.id === id) || null;
  } catch (error) {
    console.error('Error getting item by ID:', error);
    throw error;
  }
};

/**
 * Updates an existing item
 * @param {Object} updatedItem - The updated item data
 * @returns {Promise<Object>} The updated item
 */
export const updateItem = async (updatedItem) => {
  try {
    if (!updatedItem.name || !updatedItem.description) {
      throw new Error('Item name and description are required');
    }
    
    const items = await getAllItems();
    
    const existingItemIndex = items.findIndex(item => item.id === updatedItem.id);
    if (existingItemIndex === -1) {
      throw new Error('Item not found');
    }
    
    if (updatedItem.imageUri && updatedItem.imageUri !== items[existingItemIndex].imageUri) {
      updatedItem.imageUri = await ensurePermanentImage(updatedItem.imageUri);
    }
    
    updatedItem.updatedAt = new Date().toISOString();
    
    if (!updatedItem.createdAt) {
      updatedItem.createdAt = items[existingItemIndex].createdAt;
    }
    
    const updatedItems = [...items];
    updatedItems[existingItemIndex] = updatedItem;
    
    await saveItemsWithVerification(updatedItems);
    
    await createBackup(updatedItems);
    
    return updatedItem;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

/**
 * Deletes an item by ID
 * @param {string} id - The ID of the item to delete
 * @returns {Promise<boolean>} Success indicator
 */
export const deleteItem = async (id) => {
  try {
    const items = await getAllItems();
    
    const itemToDelete = items.find(item => item.id === id);
    if (!itemToDelete) {
      throw new Error('Item not found');
    }
    
    if (itemToDelete.imageUri && itemToDelete.imageUri.startsWith(FileSystem.documentDirectory)) {
      try {
        await FileSystem.deleteAsync(itemToDelete.imageUri);
      } catch (imageError) {
        console.warn('Could not delete image file:', imageError);
      }
    }
    
    const filteredItems = items.filter(item => item.id !== id);
    
    await saveItemsWithVerification(filteredItems);
    
    await createBackup(filteredItems);
    
    return true;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

/**
 * Search for items by name or description
 * @param {string} query - The search query
 * @returns {Promise<Array>} Array of matching items
 */
export const searchItems = async (query) => {
  try {
    if (!query || typeof query !== 'string') {
      return [];
    }
    
    const items = await getAllItems();
    const lowerQuery = query.toLowerCase();
    
    return items.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) || 
      item.description.toLowerCase().includes(lowerQuery) ||
      (item.location && item.location.toLowerCase().includes(lowerQuery))
    );
  } catch (error) {
    console.error('Error searching items:', error);
    throw error;
  }
};

/**
 * Export all items to a JSON file
 * @returns {Promise<string>} Path to the exported file
 */
export const exportData = async () => {
  try {
    const items = await getAllItems();
    const exportPath = FileSystem.documentDirectory + 'whereIs_export.json';
    
    await FileSystem.writeAsStringAsync(
      exportPath,
      JSON.stringify(items, null, 2)
    );
    
    return exportPath;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

/**
 * Import items from a JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {Promise<Array>} The imported items
 */
export const importData = async (filePath) => {
  try {
    const fileContent = await FileSystem.readAsStringAsync(filePath);
    const importedItems = JSON.parse(fileContent);
    
    if (!Array.isArray(importedItems)) {
      throw new Error('Invalid import format');
    }
    
    for (const item of importedItems) {
      if (!item.id || !item.name || !item.description) {
        throw new Error('Some items are missing required fields');
      }
    }
    
    await saveItemsWithVerification(importedItems);
    
    return importedItems;
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
};

// ===== Helper Functions =====

/**
 * Generate a unique ID for a new item
 * @returns {string} A unique ID
 */
const generateUniqueId = () => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

/**
 * Saves items with verification to ensure data integrity
 * @param {Array} items - The items to save
 * @returns {Promise<void>}
 */
const saveItemsWithVerification = async (items) => {
  const itemsJson = JSON.stringify(items);
  
  await SecureStore.setItemAsync(STORAGE_KEY, itemsJson);
  
  const verificationJson = await SecureStore.getItemAsync(STORAGE_KEY);
  
  if (verificationJson !== itemsJson) {
    throw new Error('Data integrity verification failed');
  }
};

/**
 * Creates a backup of the items in the file system
 * @param {Array} items - The items to backup
 * @returns {Promise<void>}
 */
const createBackup = async (items) => {
  try {
    await FileSystem.writeAsStringAsync(
      BACKUP_FILE,
      JSON.stringify(items)
    );
  } catch (error) {
    console.warn('Failed to create backup:', error);
  }
};

/**
 * Attempts to restore data from backup file
 * @returns {Promise<Array|null>} The restored items or null
 */
const restoreFromBackup = async () => {
  try {
    const backupExists = await FileSystem.getInfoAsync(BACKUP_FILE);
    
    if (backupExists.exists) {
      const backupData = await FileSystem.readAsStringAsync(BACKUP_FILE);
      return JSON.parse(backupData);
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to restore from backup:', error);
    return null;
  }
};

/**
 * Ensures an image is stored permanently
 * @param {string} uri - The image URI
 * @returns {Promise<string>} The permanent URI
 */
const ensurePermanentImage = async (uri) => {
  if (uri.startsWith(FileSystem.documentDirectory)) {
    return uri;
  }
  
  try {
    const filename = FileSystem.documentDirectory + 'images/' + generateUniqueId() + '.jpg';
    
    const dirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'images');
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'images', { intermediates: true });
    }
    
    await FileSystem.copyAsync({
      from: uri,
      to: filename
    });
    
    return filename;
  } catch (error) {
    console.error('Error making image permanent:', error);
    return uri;
  }
};