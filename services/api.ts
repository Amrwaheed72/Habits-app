import { collectionId, completionsCollectionId, databaseId, databases } from '@/lib/appwrite';
import { AddHabit, CompletedHabit, Habit } from '@/types/api.type';
import { ID, Query } from 'react-native-appwrite';

export const fetchHabits = async (userId: string): Promise<Habit[]> => {
  try {
    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.equal('user_id', userId ?? ''),
      Query.orderDesc('$createdAt'),
    ]);
    return response.documents as unknown as Habit[];
  } catch (error) {
    throw error;
  }
};

export const addHabit = async (data: AddHabit) => {
  try {
    await databases.createDocument(databaseId, collectionId, ID.unique(), data);
  } catch (error) {
    throw error;
  }
};

export const deleteHabit = async (id: string) => {
  try {
    await databases.deleteDocument(databaseId, collectionId, id);
  } catch (error) {
    throw error;
  }
};
export const completeHabit = async (id: string, userId: string, streakCount: number) => {
  const currentDate = new Date().toISOString();
  try {
    await databases.updateDocument(databaseId, collectionId, id, {
      streak_count: streakCount,
      last_completed: currentDate,
    });
    await databases.createDocument(databaseId, completionsCollectionId, ID.unique(), {
      habit_id: id,
      user_id: userId,
      completed_at: currentDate,
    });
  } catch (error) {
    throw error;
  }
};

export const getCompletedHabitsToday = async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  try {
    const response = await databases.listDocuments(databaseId, completionsCollectionId, [
      Query.equal('user_id', userId ?? ''),
      Query.greaterThanEqual('completed_at', today.toISOString()),
      Query.orderDesc('$createdAt'),
    ]);
    return response.documents as unknown as CompletedHabit[];
  } catch (error) {
    throw error;
  }
};
export const getStreaks = async (userId: string) => {
  try {
    const response = await databases.listDocuments(databaseId, completionsCollectionId, [
      Query.equal('user_id', userId ?? ''),
      Query.orderDesc('$createdAt'),
    ]);
    return response.documents as unknown as CompletedHabit[];
  } catch (error) {
    throw error;
  }
};
