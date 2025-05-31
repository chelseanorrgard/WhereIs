# Where the #?@% Is

A React Native mobile application built with Expo for tracking and managing the location of your items and belongings.

## Features

- **Item Management**: Create, view, and manage items with detailed information
- **Location Tracking**: Record and track locations of items
- **List View**: Browse through saved items in an organized list
- **Data Persistence**: Local storage for maintaining records across app sessions
- **Cross-Platform**: Works on both iOS and Android devices

## Screenshots

<!-- Add screenshots of your app here -->

## Tech Stack

- **React Native** - Mobile app framework
- **Expo** - Development platform and build tool
- **JavaScript** - Primary programming language
- **Local Storage** - Data persistence

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 14.x or higher)
- **npm** or **yarn** package manager
- **Expo CLI** (`npm install -g @expo/cli`)
- **Expo Go** app on your mobile device (for testing)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chelseanorrgard/WhereIs.git
   cd WhereIs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install navigation dependencies**
   ```bash
   npm install @react-navigation/native @react-navigation/stack
   npx expo install react-native-gesture-handler react-native-reanimated
   ```

4. **Install additional required packages**
   ```bash
   npm install react-native-safe-area-context@4.12.0
   npm install react-native-screens@~4.4.0
   npm install expo-file-system@18.0.12
   npx expo install expo-secure-store
   npx expo install expo@^53.0.0 --fix
   npx expo install expo-splash-screen
   ```

5. **Start the development server**
   ```bash
   npx expo start
   ```

6. **Run on Android device/emulator**
   ```bash
   npm run android
   ```
   
   **Alternative options:**
   - Scan the QR code with Expo Go app (Android/iOS)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## Project Structure

```
WhereIs/
├── App.js                    # Main app component
├── index.js                  # App entry point
├── app.json                  # Expo configuration
├── package.json              # Dependencies and scripts
├── assets/                   # Images and static assets
│   ├── icon.png             # App icon
│   ├── splash-icon.png      # Splash screen icon
│   ├── add.png              # Add button icon
│   ├── list.png             # List view icon
│   ├── save.png             # Save button icon
│   └── where.png            # Location icon
├── screens/                  # App screens/pages
│   ├── EntryScreen.js       # Main entry screen
│   ├── ItemDetailScreen.js  # Individual item details
│   ├── ListItemsScreen.js   # Items list view
│   └── RecordCreationScreen.js # Create new records
└── services/
    └── storage.js           # Local storage management
```

## Usage

1. **Creating Records**: Use the Record Creation screen to add new items with location data
2. **Viewing Items**: Browse your saved items in the List Items screen
3. **Item Details**: Tap on any item to view detailed information
4. **Navigation**: Use the entry screen to navigate between different sections

## Dependencies

This project uses several key dependencies:

### Core Framework
- **React Native** with **Expo SDK v53.0.0**
- **Expo File System** (v18.0.12) - File management
- **Expo Secure Store** - Secure data storage
- **Expo Splash Screen** - App launch screen management

### Navigation
- **@react-navigation/native** - Core navigation library
- **@react-navigation/stack** - Stack navigator
- **react-native-gesture-handler** - Touch gesture handling
- **react-native-reanimated** - Smooth animations
- **react-native-safe-area-context** (v4.12.0) - Safe area handling
- **react-native-screens** (v4.4.0) - Native screen optimization

For a complete list of all dependencies, see `package.json`.

## Development

### Adding New Features

1. Create new screens in the `screens/` directory
2. Add navigation logic to `App.js`
3. Update storage service if new data types are needed
4. Add corresponding assets to the `assets/` directory

### Building for Production

```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- Icons and assets designed for the application
- Thanks to the React Native community for ongoing support

---

**Note**: Make sure to run all the installation commands in the correct order as listed above for proper dependency resolution.
