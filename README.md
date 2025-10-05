# LiftUp - Nigerian Fitness Mobile App

A production-ready React Native mobile application for Nigerian gym-goers, featuring personalized workout plans, diet recommendations, and progress tracking.

## 🏋️‍♂️ Features

- **Personalized Workout Plans**: Tailored to Nigerian gym equipment and preferences
- **Local Diet Recommendations**: Featuring Nigerian foods and portion guidance
- **Progress Tracking**: Weight, measurements, and photo progress
- **Subscription Management**: Paystack integration for Nigerian Naira payments
- **Offline Support**: Cached workouts for limited connectivity
- **Minimalist Design**: Clean black & white theme for optimal performance

## 🚀 Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Firebase (Auth, Firestore, Storage, Cloud Functions)
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation v6
- **Payments**: Paystack
- **UI**: Custom black & white theme system
- **TypeScript**: Full type safety

## 📱 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LIFTUp
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Firebase and Paystack credentials in `.env`:
   ```
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

## 🔧 Development Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run on web browser
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript check

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── constants/          # Theme, colors, and constants
├── navigation/         # Navigation configuration
├── screens/           # Screen components
│   ├── auth/         # Authentication screens
│   ├── onboarding/   # User onboarding flow
│   └── main/         # Main app screens
├── services/          # API and external services
├── store/            # Redux store and slices
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## 🎨 Design System

The app uses a minimalist black & white theme:
- **Primary**: #000000 (Black)
- **Secondary**: #FFFFFF (White)
- **Grayscale**: Various shades for contrast
- **Accent**: Minimal use of success/error colors

## 🔐 Authentication

- Email/password authentication
- Phone number with OTP verification
- Social sign-in (Google, Apple)
- Secure user profile management

## 💰 Payment Integration

- Paystack integration for NGN payments
- Subscription plans (Monthly, Quarterly, Yearly)
- Server-side receipt verification
- Secure payment processing

## 📊 Nigerian-Specific Features

- **Local Foods**: Jollof rice, eba, plantain, beans alternatives
- **Currency**: Nigerian Naira (NGN) pricing
- **Equipment**: Plans for home, basic gym, and full gym setups
- **Units**: Metric system by default
- **Connectivity**: Optimized for varying internet speeds

## 🚀 Deployment

### Android
```bash
npm run build:android
```

### iOS
```bash
npm run build:ios
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, contact the development team or create an issue in the repository.

---

**LiftUp** - Empowering Nigerian fitness journeys, one workout at a time. 🇳🇬💪