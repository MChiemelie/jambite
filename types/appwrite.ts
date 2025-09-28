// ============ Base ============

// Generic Appwrite system fields
export interface AppwriteDoc {
  $id: string;
  createdAt: string;
  $updatedAt: string;
  $permissions?: string[];
  $collectionId?: string;
  $databaseId?: string;
}

// Generic Appwrite list response
export interface AppwriteList<T> {
  total: number;
  documents: T[];
}
