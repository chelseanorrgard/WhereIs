# 🔍 Where the #?@% Is

> 📱 Never lose track of your stuff again! A React Native mobile app that remembers where you put everything.

A sleek React Native mobile application built with Expo for tracking and managing the location of your items and belongings. Because we've all been there - frantically searching for that one thing we "put somewhere safe"! 🤦‍♀️

---

## ✨ Features

🏷️ **Item Management** - Create, view, and manage items with detailed information  
📍 **Location Tracking** - Record and track exact locations of your precious belongings  
📋 **List View** - Browse through saved items in a beautiful, organized list  
💾 **Data Persistence** - Local storage keeps your records safe across app sessions  
🌐 **Cross-Platform** - Works seamlessly on both iOS and Android devices  
📸 **Photo Support** - Snap pictures to remember exactly where you put things  
🔍 **Smart Search** - Find your items quickly with powerful search functionality  
✏️ **Edit & Delete** - Update item details or remove items you no longer need  
🛡️ **Secure Storage** - Your data is encrypted and stored safely  

---

## 📸 Screenshots

> 💡 *Coming soon! 

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| ⚛️ **React Native** | Mobile app framework |
| 🚀 **Expo** | Development platform and build tool |
| 📜 **JavaScript** | Primary programming language |
| 💽 **Local Storage** | Data persistence magic |

---

## 🔧 Prerequisites

Before diving in, make sure you have these essentials installed:

- 📦 **Node.js** (version 14.x or higher)
- 🔧 **npm** or **yarn** package manager  
- 🌟 **Expo CLI** (`npm install -g @expo/cli`)
- 📱 **Expo Go** app on your mobile device (for testing)

---

## 🚀 Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/chelseanorrgard/WhereIs.git
cd WhereIs
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Install navigation dependencies
```bash
npm install @react-navigation/native @react-navigation/stack
npx expo install react-native-gesture-handler react-native-reanimated
```

### 4️⃣ Install additional required packages
```bash
npm install react-native-safe-area-context@4.12.0
npm install react-native-screens@~4.4.0
npm install expo-file-system@18.0.12
npx expo install expo-secure-store
npx expo install expo@^53.0.0 --fix
npx expo install expo-splash-screen
```

### 5️⃣ Start the development server
```bash
npx expo start
```

### 6️⃣ Run on your device
```bash
npm run android
```

**🎯 Alternative options:**
- 📱 Scan the QR code with Expo Go app (Android/iOS)
- 🤖 Press `a` for Android emulator
- 🍎 Press `i` for iOS simulator

---

## 📁 Project Structure

```
WhereIs/
├── 📱 App.js                    # Main app component
├── 🚪 index.js                  # App entry point
├── ⚙️ app.json                  # Expo configuration
├── 📦 package.json              # Dependencies and scripts
├── 🖼️ assets/                   # Images and static assets
│   ├── icon.png                # App icon
│   ├── splash-icon.png         # Splash screen icon
│   ├── add.png                 # Add button icon
│   ├── list.png                # List view icon
│   ├── save.png                # Save button icon
│   └── where.png               # Location icon
├── 📱 screens/                  # App screens/pages
│   ├── EntryScreen.js          # Main entry screen
│   ├── ItemDetailScreen.js     # Individual item details
│   ├── ListItemsScreen.js      # Items list view
│   └── RecordCreationScreen.js # Create new records
└── 🔧 services/
    └── storage.js              # Local storage management
```

---

## 🎮 Usage Guide

| Action | Description |
|--------|-------------|
| ➕ **Creating Records** | Use the Record Creation screen to add new items with location data |
| 👀 **Viewing Items** | Browse your saved items in the gorgeous List Items screen |
| 🔍 **Item Details** | Tap on any item to view all the juicy details |
| 🧭 **Navigation** | Use the entry screen to navigate between different sections |

---

## 📋 Dependencies

### 🏗️ Core Framework
- ⚛️ **React Native** with **Expo SDK v53.0.0**
- 📁 **Expo File System** (v18.0.12) - File management wizardry
- 🔐 **Expo Secure Store** - Fort Knox-level data security
- 🌅 **Expo Splash Screen** - Beautiful app launch experience

### 🧭 Navigation
- 🗺️ **@react-navigation/native** - Core navigation library
- 📚 **@react-navigation/stack** - Stack navigator for smooth transitions
- 👆 **react-native-gesture-handler** - Silky smooth touch gestures
- ✨ **react-native-reanimated** - Buttery smooth animations
- 🔒 **react-native-safe-area-context** (v4.12.0) - Safe area wizardry
- 📺 **react-native-screens** (v4.4.0) - Native screen optimization

> 📋 *For the complete dependency list, check out `package.json`*

---

## 🏗️ Development

### 🆕 Adding New Features

1. 📝 Create new screens in the `screens/` directory
2. 🔗 Add navigation logic to `App.js`
3. 💾 Update storage service if new data types are needed
4. 🎨 Add corresponding assets to the `assets/` directory

### 🏭 Building for Production

```bash
# 🤖 Build for Android
npx expo build:android

# 🍎 Build for iOS
npx expo build:ios
```

---

## 🤝 Contributing

We'd love your help making this app even more awesome!

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 🚀 Push to the branch (`git push origin feature/amazing-feature`)
5. 🎯 Open a Pull Request

---

## 🙏 Acknowledgments

- 🚀 Built with love using [Expo](https://expo.dev/)
- 🎨 Icons and assets designed specifically for this application
- 👥 Huge thanks to the React Native community for ongoing support and inspiration
- ☕ Powered by countless cups of coffee and determination

---

## 🎯 Feature Roadmap

Based on the original requirements, here are some exciting features that could be added:

### 🔍 Advanced Search & Filtering
- Smart search with partial matching
- Filter by location, date added, or item type
- Search history and suggestions

### 📸 Enhanced Photo Management  
- Multiple photos per item
- Photo compression and optimization
- Before/after location photos

### 🗺️ GPS & Location Services
- Automatic GPS location capture
- Location-based reminders
- Map view of your items

### ✏️ Advanced Editing
- Batch edit multiple items
- Item categories and tags
- Export/import functionality

### 🔐 Security & Backup
- Cloud sync and backup
- Data encryption
- User authentication

---

> 🚨 **Important Note**: Make sure to run all installation commands in the correct order for proper dependency resolution. Happy coding! 🎉

---

*Made with ❤️ and a lot of "where did I put that thing?" moments*
