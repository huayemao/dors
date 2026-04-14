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

  async getFileStream(fileName: string, isThumbnail?: boolean): Promise<ReadableStream<Uint8Array> | null> {
    const file = await prisma.file.findFirst({
      where: {
        name: fileName,
      },
    });

    if (!file) {
      return null;
    }

    const buffer = Buffer.from(file.data || []);
    
    // 对于缩略图，生成100x100的缩略图
    if (isThumbnail && file.mimeType?.startsWith('image/')) {
      try {
        const sharp = await import('sharp');
        const resizedBuffer = await sharp.default(buffer)
          .resize(100, 100, { fit: 'cover' })
          .toBuffer();
        const blob = new Blob([resizedBuffer.buffer as ArrayBuffer]);
        return blob.stream();
      } catch (error) {
        console.error('Error generating thumbnail:', error);
        // 生成缩略图失败，返回原图
        const blob = new Blob([buffer.buffer]);
        return blob.stream();
      }
    }

    const blob = new Blob([buffer.buffer]);
    return blob.stream();
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
