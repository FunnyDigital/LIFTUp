# Firebase Firestore Security Rules Setup

## Current Issue
The app is getting "Missing or insufficient permissions" errors because Firestore security rules need to be configured.

## Quick Fix (Development Only - Already Applied)
I've updated the `userDataService.ts` to store workout and meal progress directly in the user document instead of subcollections. This works with the existing basic security rules that allow users to read/write their own user document.

## Production Setup (Required for Production)

### Option 1: Via Firebase Console (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **LIFTUp**
3. Navigate to **Firestore Database** → **Rules** tab
4. Copy the rules from `firestore.rules` file in this project
5. Click **Publish** to deploy the rules

### Option 2: Via Firebase CLI
```bash
# Install Firebase CLI if you haven't
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init firestore

# Deploy the rules
firebase deploy --only firestore:rules
```

## Current Data Structure
All user data is now stored in a single document for better performance and simpler security:

```
users/{userId}/
  ├── profile: { firstName, lastName, age, ... }
  ├── workoutPlan: { ... }
  ├── dietPlan: { ... }
  ├── workoutProgress: {
  │     "2025-11-13_Mon": {
  │       completedExercises: { "exercise-1": true, ... },
  │       updatedAt: Timestamp
  │     }
  │   }
  └── mealProgress: {
        "2025-11-13": {
          breakfast: true,
          lunch: false,
          dinner: false,
          updatedAt: Timestamp
        }
      }
```

## Testing Rules
The `firestore.rules` file includes:
- ✅ Users can only read/write their own data
- ✅ Authenticated users can access their workout/meal progress
- ✅ Progress entries are user-specific
- ✅ Public workout/diet libraries are read-only

## Current Status
✅ **Fixed** - No more permission errors. Data is stored in user document which existing rules allow.
⚠️ **Deploy rules** to Firebase Console for production security.
