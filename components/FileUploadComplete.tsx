import React, { useState } from 'react';
import { BaseCard, BaseButton } from '@glint-ui/react';
import { copyToClipboard } from '@/lib/client/utils/copyToClipboard';

interface FileUploadCompleteProps {
  files: Array<{
    id: number;
    name: string;
    displayName: string;
    size: bigint;
    mimeType: string;
  }>;
}

export function FileUploadComplete({ files }: FileUploadCompleteProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    const markdown = files
      .map((file) => {
        const url = encodeURI(`/api/files/${file.name}`);
        return `![${file.displayName}](${url})`;
      })
      .join('\n');

    copyToClipboard(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h3 className="text-lg font-semibold mb-3">上传完成</h3>
      <div className="space-y-3">
        {files.map((file) => (
          <BaseCard key={file.id} shadow="flat" className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {file.mimeType.startsWith('image/') && (
                  <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden mr-3">
                    <img
                      src={`/api/files/${file.name}`}
                      alt={file.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="font-medium text-sm">{file.displayName}</div>
                  <div className="text-xs text-gray-500">
                    {file.mimeType} • {Math.round(Number(file.size) / 1024)}KB
                  </div>
                </div>
              </div>
              <div>
                <BaseButton
                  size="sm"
                  variant='pastel'
                  onClick={() => {
                    const url = encodeURI(`/api/files/${file.name}`);
                    copyToClipboard(`![${file.displayName}](${url})`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  复制链接
                </BaseButton>
              </div>
            </div>
          </BaseCard>
        ))}
      </div>
      <div className="mt-4">
        <BaseButton
          
          onClick={handleCopyMarkdown}
        >
          {copied ? '已复制' : '一键复制所有 Markdown'}
        </BaseButton>
      </div>
    </div>
  );
}
