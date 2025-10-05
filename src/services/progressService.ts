import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { ProgressEntry, BodyMeasurements, ProgressPhoto } from '@/types';

// Collections
const PROGRESS_ENTRIES_COLLECTION = 'progress_entries';
const PROGRESS_PHOTOS_COLLECTION = 'progress_photos';

class ProgressService {
  // Progress Entries
  async addProgressEntry(userId: string, entryData: {
    date: Date;
    weight?: number;
    bodyFatPercentage?: number;
    measurements?: BodyMeasurements;
    notes?: string;
  }): Promise<string> {
    try {
      const progressEntry: Omit<ProgressEntry, 'id' | 'photos'> = {
        userId,
        date: entryData.date,
        weight: entryData.weight,
        bodyFatPercentage: entryData.bodyFatPercentage,
        measurements: entryData.measurements,
        notes: entryData.notes,
      };
      
      const docRef = await addDoc(
        collection(db, PROGRESS_ENTRIES_COLLECTION),
        {
          ...progressEntry,
          date: Timestamp.fromDate(entryData.date),
          createdAt: Timestamp.now(),
        }
      );
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding progress entry:', error);
      throw error;
    }
  }

  async getUserProgressEntries(
    userId: string,
    startDate?: Date,
    endDate?: Date,
    limitCount?: number
  ): Promise<ProgressEntry[]> {
    try {
      let q = query(
        collection(db, PROGRESS_ENTRIES_COLLECTION),
        where('userId', '==', userId)
      );
      
      if (startDate) {
        q = query(q, where('date', '>=', Timestamp.fromDate(startDate)));
      }
      
      if (endDate) {
        q = query(q, where('date', '<=', Timestamp.fromDate(endDate)));
      }
      
      q = query(q, orderBy('date', 'desc'));
      
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      const entries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
      })) as ProgressEntry[];
      
      // Fetch associated photos for each entry
      for (const entry of entries) {
        entry.photos = await this.getProgressPhotos(entry.id);
      }
      
      return entries;
    } catch (error) {
      console.error('Error fetching user progress entries:', error);
      throw error;
    }
  }

  async updateProgressEntry(
    entryId: string,
    updates: {
      weight?: number;
      bodyFatPercentage?: number;
      measurements?: BodyMeasurements;
      notes?: string;
    }
  ): Promise<void> {
    try {
      const docRef = doc(db, PROGRESS_ENTRIES_COLLECTION, entryId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating progress entry:', error);
      throw error;
    }
  }

  async deleteProgressEntry(entryId: string): Promise<void> {
    try {
      // Delete associated photos first
      const photos = await this.getProgressPhotos(entryId);
      for (const photo of photos) {
        await this.deleteProgressPhoto(photo.id);
      }
      
      // Delete the entry
      const docRef = doc(db, PROGRESS_ENTRIES_COLLECTION, entryId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting progress entry:', error);
      throw error;
    }
  }

  // Progress Photos
  async uploadProgressPhoto(
    entryId: string,
    imageBlob: Blob,
    type: 'front' | 'side' | 'back'
  ): Promise<string> {
    try {
      // Create unique filename
      const filename = `progress/${entryId}/${type}_${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      
      // Upload image
      await uploadBytes(storageRef, imageBlob);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Save photo metadata to Firestore
      const photoData = {
        entryId,
        url: downloadURL,
        type,
        uploadedAt: Timestamp.now(),
      };
      
      const docRef = await addDoc(
        collection(db, PROGRESS_PHOTOS_COLLECTION),
        photoData
      );
      
      return docRef.id;
    } catch (error) {
      console.error('Error uploading progress photo:', error);
      throw error;
    }
  }

  async getProgressPhotos(entryId: string): Promise<ProgressPhoto[]> {
    try {
      const q = query(
        collection(db, PROGRESS_PHOTOS_COLLECTION),
        where('entryId', '==', entryId),
        orderBy('uploadedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate(),
      })) as ProgressPhoto[];
    } catch (error) {
      console.error('Error fetching progress photos:', error);
      throw error;
    }
  }

  async deleteProgressPhoto(photoId: string): Promise<void> {
    try {
      // Get photo data to get storage URL
      const docRef = doc(db, PROGRESS_PHOTOS_COLLECTION, photoId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const photoData = docSnap.data();
        
        // Delete from storage
        const storageRef = ref(storage, photoData.url);
        await deleteObject(storageRef);
      }
      
      // Delete from Firestore
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting progress photo:', error);
      throw error;
    }
  }

  // Analytics and Statistics
  async getProgressStats(userId: string, period: 'week' | 'month' | '3months' | 'year'): Promise<{
    weightChange: number;
    averageWeight: number;
    bodyFatChange?: number;
    measurementChanges?: Partial<BodyMeasurements>;
    totalEntries: number;
  }> {
    try {
      const now = new Date();
      let startDate: Date;
      
      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '3months':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
      }
      
      const entries = await this.getUserProgressEntries(userId, startDate, now);
      
      if (entries.length === 0) {
        return {
          weightChange: 0,
          averageWeight: 0,
          totalEntries: 0,
        };
      }
      
      const weightsEntries = entries.filter(e => e.weight !== undefined);
      const bodyFatEntries = entries.filter(e => e.bodyFatPercentage !== undefined);
      
      // Calculate weight statistics
      const weights = weightsEntries.map(e => e.weight!);
      const averageWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;
      const weightChange = weights.length > 1 ? weights[0] - weights[weights.length - 1] : 0;
      
      // Calculate body fat change
      const bodyFatChange = bodyFatEntries.length > 1 
        ? bodyFatEntries[0].bodyFatPercentage! - bodyFatEntries[bodyFatEntries.length - 1].bodyFatPercentage!
        : undefined;
      
      // Calculate measurement changes
      const measurementEntries = entries.filter(e => e.measurements);
      let measurementChanges: Partial<BodyMeasurements> | undefined;
      
      if (measurementEntries.length > 1) {
        const latest = measurementEntries[0].measurements!;
        const earliest = measurementEntries[measurementEntries.length - 1].measurements!;
        
        measurementChanges = {
          chest: latest.chest && earliest.chest ? latest.chest - earliest.chest : undefined,
          waist: latest.waist && earliest.waist ? latest.waist - earliest.waist : undefined,
          hips: latest.hips && earliest.hips ? latest.hips - earliest.hips : undefined,
          biceps: latest.biceps && earliest.biceps ? latest.biceps - earliest.biceps : undefined,
          thighs: latest.thighs && earliest.thighs ? latest.thighs - earliest.thighs : undefined,
          neck: latest.neck && earliest.neck ? latest.neck - earliest.neck : undefined,
        };
      }
      
      return {
        weightChange,
        averageWeight,
        bodyFatChange,
        measurementChanges,
        totalEntries: entries.length,
      };
    } catch (error) {
      console.error('Error getting progress stats:', error);
      throw error;
    }
  }

  async getWeightTrend(userId: string, days: number = 30): Promise<Array<{ date: Date; weight: number }>> {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const entries = await this.getUserProgressEntries(userId, startDate);
      
      return entries
        .filter(entry => entry.weight !== undefined)
        .map(entry => ({
          date: entry.date,
          weight: entry.weight!,
        }))
        .reverse(); // Oldest first for trend analysis
    } catch (error) {
      console.error('Error getting weight trend:', error);
      throw error;
    }
  }
}

export const progressService = new ProgressService();
export default progressService;