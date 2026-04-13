import { FileStorageProvider, FileData, FileMetadata } from './provider';
import { DatabaseStorageProvider } from './database-provider';
import { PocketBaseStorageProvider } from './pocketbase-provider';

export type StorageProviderType = 'database' | 'pocketbase';

export class StorageManager {
  private providers: Map<StorageProviderType, FileStorageProvider> = new Map();
  private defaultProvider: StorageProviderType = 'database';

  constructor() {
    this.providers.set('database', new DatabaseStorageProvider());
  }

  registerPocketBaseProvider(
    url: string,
    email: string,
    password: string,
    collectionName?: string
  ) {
    const provider = new PocketBaseStorageProvider(url, email, password, collectionName);
    this.providers.set('pocketbase', provider);
  }

  setDefaultProvider(provider: StorageProviderType) {
    if (!this.providers.has(provider)) {
      throw new Error(`Provider ${provider} is not registered`);
    }
    this.defaultProvider = provider;
  }

  getProvider(providerType?: StorageProviderType): FileStorageProvider {
    const type = providerType || this.defaultProvider;
    const provider = this.providers.get(type);

    if (!provider) {
      throw new Error(`Provider ${type} is not registered`);
    }

    return provider;
  }

  async saveFile(fileData: FileData, providerType?: StorageProviderType): Promise<FileMetadata> {
    const provider = this.getProvider(providerType);
    return provider.saveFile(fileData);
  }

  async getFile(fileName: string, providerType?: StorageProviderType): Promise<Buffer | null> {
    const provider = this.getProvider(providerType);
    return provider.getFile(fileName);
  }

  async deleteFile(fileName: string, providerType?: StorageProviderType): Promise<boolean> {
    const provider = this.getProvider(providerType);
    return provider.deleteFile(fileName);
  }

  async fileExists(fileName: string, providerType?: StorageProviderType): Promise<boolean> {
    const provider = this.getProvider(providerType);
    return provider.fileExists(fileName);
  }
}

let storageManagerInstance: StorageManager | null = null;

export function getStorageManager(): StorageManager {
  if (!storageManagerInstance) {
    storageManagerInstance = new StorageManager();

    if (process.env.POCKETBASE_URL && process.env.POCKETBASE_EMAIL && process.env.POCKETBASE_PASSWORD) {
      storageManagerInstance.registerPocketBaseProvider(
        process.env.POCKETBASE_URL,
        process.env.POCKETBASE_EMAIL,
        process.env.POCKETBASE_PASSWORD,
        process.env.POCKETBASE_COLLECTION_NAME
      );

      if (process.env.DEFAULT_STORAGE_PROVIDER) {
        storageManagerInstance.setDefaultProvider(process.env.DEFAULT_STORAGE_PROVIDER as StorageProviderType);
      }
    }
  }

  return storageManagerInstance;
}
