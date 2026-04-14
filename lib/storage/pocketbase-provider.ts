import PocketBase from 'pocketbase';
import { FileStorageProvider, FileData, FileMetadata } from './provider';

export class PocketBaseStorageProvider implements FileStorageProvider {
  private pb: PocketBase;
  private collectionName: string;

  constructor(
    private url: string,
    private email: string,
    private password: string,
    collectionName: string = 'files'
  ) {
    this.pb = new PocketBase(url);
    this.collectionName = collectionName;
  }

  private async ensureAuthenticated() {
    if (!this.pb.authStore.isValid) {
      await this.pb.collection('_superusers').authWithPassword(this.email, this.password);
    }
  }

  async saveFile(fileData: FileData): Promise<FileMetadata> {
    await this.ensureAuthenticated();

    const formData = new FormData();
    const blob = new Blob([fileData.buffer as any], { type: fileData.mimeType });
    formData.append('file', blob, fileData.fileName);
    formData.append('name', fileData.fileName);
    formData.append('mimeType', fileData.mimeType);
    formData.append('size', String(fileData.size));

    const record = await this.pb.collection(this.collectionName).create(formData);

    return {
      fileName: fileData.fileName,
      size: fileData.size,
      mimeType: fileData.mimeType,
      provider: 'pocketbase',
      url: record.file,
    };
  }

  async getFile(fileName: string): Promise<Buffer | null> {
    await this.ensureAuthenticated();

    try {
      const records = await this.pb.collection(this.collectionName).getList(1, 1, {
        filter: `name = "${fileName}"`,
      });

      if (records.items.length === 0) {
        return null;
      }

      const record = records.items[0];
      const fileUrl = this.pb.files.getUrl(record, record.file);

      const response = await fetch(fileUrl);
      if (!response.ok) {
        return null;
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('Error fetching file from PocketBase:', error);
      return null;
    }
  }

  async getFileStream(fileName: string): Promise<ReadableStream<Uint8Array> | null> {
    await this.ensureAuthenticated();

    try {
      const records = await this.pb.collection(this.collectionName).getList(1, 1, {
        filter: `name = "${fileName}"`,
      });

      if (records.items.length === 0) {
        return null;
      }

      const record = records.items[0];
      const fileUrl = this.pb.files.getUrl(record, record.file);

      const response = await fetch(fileUrl);
      if (!response.ok) {
        return null;
      }

      return response.body;
    } catch (error) {
      console.error('Error fetching file stream from PocketBase:', error);
      return null;
    }
  }

  async deleteFile(fileName: string): Promise<boolean> {
    await this.ensureAuthenticated();

    try {
      const records = await this.pb.collection(this.collectionName).getList(1, 1, {
        filter: `name = "${fileName}"`,
      });

      if (records.items.length === 0) {
        return false;
      }

      await this.pb.collection(this.collectionName).delete(records.items[0].id);
      return true;
    } catch (error) {
      console.error('Error deleting file from PocketBase:', error);
      return false;
    }
  }

  async fileExists(fileName: string): Promise<boolean> {
    await this.ensureAuthenticated();

    try {
      const records = await this.pb.collection(this.collectionName).getList(1, 1, {
        filter: `name = "${fileName}"`,
      });

      return records.items.length > 0;
    } catch (error) {
      console.error('Error checking file existence in PocketBase:', error);
      return false;
    }
  }
}
