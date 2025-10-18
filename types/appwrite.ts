export interface AppwriteDoc {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
  $collectionId?: string;
  $databaseId?: string;
}

export interface AppwriteList<T> {
  total: number;
  documents: T[];
}
