export interface StorageUploadResponse {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface StorageFile {
  file: File;
  path: string;
}

export interface AvatarUploadData {
  file: File;
  userId: string;
}

export interface StorageErrorResponse {
  error: string;
  status?: number;
}
