import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  PhoneAuthProvider,
  signInWithCredential,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, UserProfile } from '@/types';

class AuthService {
  private currentUser: User | null = null;

  constructor() {
    // Listen for auth state changes
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await this.getUserFromFirebase(firebaseUser);
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });
  }

  async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = await this.getUserFromFirebase(userCredential.user);
      this.currentUser = user;
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Sign in failed');
    }
  }

  async signUpWithEmail(email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = await this.createUserDocument(userCredential.user, { email });
      this.currentUser = user;
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Sign up failed');
    }
  }

  async signInWithPhone(phoneNumber: string, otp: string): Promise<User> {
    try {
      // This is a simplified version - in production, you'd implement proper phone auth flow
      // with verification ID from Firebase
      const credential = PhoneAuthProvider.credential('verification_id', otp);
      const userCredential = await signInWithCredential(auth, credential);
      const user = await this.getUserFromFirebase(userCredential.user);
      this.currentUser = user;
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Phone sign in failed');
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      this.currentUser = null;
    } catch (error: any) {
      throw new Error(error.message || 'Sign out failed');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (auth.currentUser && !this.currentUser) {
      this.currentUser = await this.getUserFromFirebase(auth.currentUser);
    }
    return this.currentUser;
  }

  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        profile: profile,
        updatedAt: new Date(),
      });
      
      if (this.currentUser) {
        this.currentUser.profile = { ...this.currentUser.profile, ...profile };
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  private async getUserFromFirebase(firebaseUser: FirebaseUser): Promise<User> {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Convert Firestore Timestamp to ISO string for all date fields
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        phoneNumber: firebaseUser.phoneNumber || undefined,
        profile: userData.profile || {},
        subscription: {
          ...userData.subscription,
          currentPeriodStart: userData.subscription?.currentPeriodStart?.toDate?.() ? userData.subscription.currentPeriodStart.toDate().toISOString() : '',
          currentPeriodEnd: userData.subscription?.currentPeriodEnd?.toDate?.() ? userData.subscription.currentPeriodEnd.toDate().toISOString() : '',
        },
        createdAt: userData.createdAt?.toDate?.() ? userData.createdAt.toDate().toISOString() : '',
        updatedAt: userData.updatedAt?.toDate?.() ? userData.updatedAt.toDate().toISOString() : '',
      } as User;
    } else {
      // User document doesn't exist, create it
      return await this.createUserDocument(firebaseUser, {
        email: firebaseUser.email || '',
        phoneNumber: firebaseUser.phoneNumber || undefined,
      });
    }
  }

  private async createUserDocument(
    firebaseUser: FirebaseUser,
    additionalData: { email?: string; phoneNumber?: string }
  ): Promise<User> {
    const userRef = doc(db, 'users', firebaseUser.uid);
      const now = new Date().toISOString();
    
    const userData: Omit<User, 'id'> = {
      email: additionalData.email || firebaseUser.email || '',
      phoneNumber: (additionalData.phoneNumber || firebaseUser.phoneNumber || ''),
      profile: {} as UserProfile,
      subscription: {
        isActive: false,
        plan: {
          id: '',
          name: '',
          duration: 'monthly',
          priceNGN: 0,
          features: [],
        },
          currentPeriodStart: now,
          currentPeriodEnd: now,
      },
        createdAt: now,
        updatedAt: now,
    };

    await setDoc(userRef, userData);

    return {
      id: firebaseUser.uid,
      ...userData,
    };
  }

  // Phone auth helper methods
  async sendPhoneVerification(phoneNumber: string): Promise<string> {
    // This would implement Firebase phone auth verification
    // Returns verification ID
    return 'verification_id_placeholder';
  }

  async verifyPhoneCode(verificationId: string, code: string): Promise<boolean> {
    // This would verify the phone code
    return true;
  }
}

export const authService = new AuthService();