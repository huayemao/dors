import prisma from '@/lib/prisma';
import { FileStorageProvider, FileData, FileMetadata } from './provider';

export class DatabaseStorageProvider implements FileStorageProvider {
  async saveFile(fileData: FileData): Promise<FileMetadata> {
    const file = await prisma.file.create({
      data: {
        name: fileData.fileName,
        displayName: fileData.fileName,
        data: fileData.buffer,
        mimeType: fileData.mimeType,
        size: BigInt(fileData.size),
      },
    });

    return {
      fileName: file.name,
      size: fileData.size,
      mimeType: fileData.mimeType,
      provider: 'database',
      url: `/api/files/${file.name}`,
    };
  }

  async getFile(fileName: string): Promise<Buffer | null> {
    const file = await prisma.file.findFirst({
      where: {
        name: fileName,
      },
    });

    if (!file) {
      return null;
    }

    return Buffer.from(file.data || []);
  }

  async deleteFile(fileName: string): Promise<boolean> {
    try {
      const file = await prisma.file.findFirst({
        where: {
          name: fileName,
        },
      });

      if (!file) {
        return false;
      }

      await prisma.file.delete({
        where: { id: file.id },
      });

      return true;
    } catch (error) {
      console.error('Error deleting file from database:', error);
      return false;
    }
  }

  async fileExists(fileName: string): Promise<boolean> {
    const file = await prisma.file.findFirst({
      where: {
        name: fileName,
      },
    });

    return file !== null;
  }
}
