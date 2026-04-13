import { migrateFilesToPocketBase, rollbackMigration } from '@/lib/storage/migrate';

export const maxDuration = 30000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, batchSize = 10, skipExisting = true } = body;
    console.log(body);
    if (action === 'migrate') {
      const result = await migrateFilesToPocketBase({
        batchSize,
        skipExisting,
        onProgress: (current, total, fileName) => {
          console.log(`Progress: ${current}/${total} - ${fileName}`);
        },
      });

      return new Response(JSON.stringify({
        success: true,
        action: 'migrate',
        result,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (action === 'rollback') {
      const result = await rollbackMigration({
        batchSize,
        onProgress: (current, total, fileName) => {
          console.log(`Progress: ${current}/${total} - ${fileName}`);
        },
      });

      return new Response(JSON.stringify({
        success: true,
        action: 'rollback',
        result,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({
        error: 'Invalid action. Use "migrate" or "rollback"',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
