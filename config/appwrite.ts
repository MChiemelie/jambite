export const appwriteConfig = {
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
  practicesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_PRACTICES_COLLECTION!,
  performancesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_PERFORMANCES_COLLECTION!,
  paymentsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_PAYMENTS_COLLECTION!,
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
  secretKey: process.env.NEXT_APPWRITE_KEY!,
};
