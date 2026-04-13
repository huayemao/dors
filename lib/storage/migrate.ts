import prisma from '@/lib/prisma';
import { getStorageManager } from '@/lib/storage/manager';

export async function migrateFilesToPocketBase(options: {
  batchSize?: number;
  skipExisting?: boolean;
  onProgress?: (current: number, total: number, fileName: string) => void;
}) {
  const { batchSize = 10, skipExisting = true, onProgress } = options;

  const storageManager = getStorageManager();

  console.log('start migration...');

  // Get total count first
  const totalFiles = await prisma.file.count({
    where: {
      provider: 'database',
      data: {
        not: null,
      },
    },
  });

  let migratedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  console.log(`Found ${totalFiles} files to migrate`);

  // Process in batches
  let skip = 0;
  while (skip < totalFiles) {
    const files = await prisma.file.findMany({
      where: {
        provider: 'database',
        data: {
          not: null,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      skip,
      take: batchSize,
    });

    for (const file of files) {
    try {
      if (skipExisting) {
        const exists = await storageManager.fileExists(file.name, 'pocketbase');
        if (exists) {
          skippedCount++;
          console.log(`Skipping existing file: ${file.name}`);
          if (onProgress) {
            onProgress(migratedCount + skippedCount + failedCount, totalFiles, file.name);
          }
          continue;
        }
      }

      const buffer = Buffer.from(file.data || []);
      
      await storageManager.saveFile({
        buffer,
        fileName: file.name,
        mimeType: file.mimeType,
        size: Number(file.size || 0),
      }, 'pocketbase');

      // await prisma.file.update({
      //   where: { id: file.id },
      //   data: {
      //     provider: 'pocketbase',
      //     data: null,
      //   },
      // });

      migratedCount++;
      console.log(`Migrated file ${migratedCount}/${totalFiles}: ${file.name}`);

      if (onProgress) {
        onProgress(migratedCount + skippedCount + failedCount, totalFiles, file.name);
      }

      if (migratedCount % batchSize === 0) {
        console.log(`Batch completed. Waiting 1 second...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      failedCount++;
      console.error(`Failed to migrate file ${file.name}:`, error);
      
      if (onProgress) {
        onProgress(migratedCount + skippedCount + failedCount, totalFiles, file.name);
      }
    }
    }
    
    skip += batchSize;
  }

  console.log(`\nMigration complete:`);
  console.log(`- Total files: ${totalFiles}`);
  console.log(`- Migrated: ${migratedCount}`);
  console.log(`- Skipped: ${skippedCount}`);
  console.log(`- Failed: ${failedCount}`);

  return {
    total: totalFiles,
    migrated: migratedCount,
    skipped: skippedCount,
    failed: failedCount,
  };
}

export async function rollbackMigration(options: {
  batchSize?: number;
  onProgress?: (current: number, total: number, fileName: string) => void;
}) {
  const { batchSize = 10, onProgress } = options;

  const storageManager = getStorageManager();

  // Get total count first
  const totalFiles = await prisma.file.count({
    where: {
      provider: 'pocketbase',
    },
  });

  let rolledBackCount = 0;
  let failedCount = 0;

  console.log(`Found ${totalFiles} files to rollback`);

  // Process in batches
  let skip = 0;
  while (skip < totalFiles) {
    const files = await prisma.file.findMany({
      where: {
        provider: 'pocketbase',
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: batchSize,
    });

    for (const file of files) {
    try {
      const buffer = await storageManager.getFile(file.name, 'pocketbase');
      
      if (!buffer) {
        console.error(`Failed to retrieve file from PocketBase: ${file.name}`);
        failedCount++;
        continue;
      }

      await prisma.file.update({
        where: { id: file.id },
        data: {
          provider: 'database',
          data: buffer,
        },
      });

      await storageManager.deleteFile(file.name, 'pocketbase');

      rolledBackCount++;
      console.log(`Rolled back file ${rolledBackCount}/${totalFiles}: ${file.name}`);

      if (onProgress) {
        onProgress(rolledBackCount + failedCount, totalFiles, file.name);
      }

      if (rolledBackCount % batchSize === 0) {
        console.log(`Batch completed. Waiting 1 second...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      failedCount++;
      console.error(`Failed to rollback file ${file.name}:`, error);
      
      if (onProgress) {
        onProgress(rolledBackCount + failedCount, totalFiles, file.name);
      }
    }
    }
    
    skip += batchSize;
  }

  console.log(`\nRollback complete:`);
  console.log(`- Total files: ${totalFiles}`);
  console.log(`- Rolled back: ${rolledBackCount}`);
  console.log(`- Failed: ${failedCount}`);

  return {
    total: totalFiles,
    rolledBack: rolledBackCount,
    failed: failedCount,
  };
}
