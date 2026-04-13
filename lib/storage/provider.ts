export interface FileStorageProvider {
  saveFile(fileData: FileData): Promise<FileMetadata>;
  getFile(fileName: string): Promise<Buffer | null>;
  deleteFile(fileName: string): Promise<boolean>;
  fileExists(fileName: string): Promise<boolean>;
}

export interface FileData {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  size: number;
}

export interface FileMetadata {
  fileName: string;
  size: number;
  mimeType: string;
  provider: string;
  url?: string;
}
