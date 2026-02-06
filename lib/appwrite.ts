import { Account, Client, Databases } from 'react-native-appwrite';

const endPoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;

const client = new Client()
  .setEndpoint(endPoint!)
  .setProject(projectId!)
  .setPlatform('amr.habits-app');

export const account = new Account(client);
export const databases = new Databases(client);
export const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
export const collectionId = process.env.EXPO_PUBLIC_APPWRITE_HABITS_COLLECTION_ID!;
export const completionsCollectionId =
  process.env.EXPO_PUBLIC_APPWRITE_HABITS_COMPLETION_COLLECTION_ID!;
