"use client";
import React from 'react';
import { Modal } from './Base/Modal';
import { UploadForm } from './UploadForm';

interface FileReuploadModalProps {
  file: {
    id: number;
    name: string;
    displayName: string;
  } | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function FileReuploadModal({ file, open, onClose, onSuccess }: FileReuploadModalProps) {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  if (!file) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="重新上传文件"
      size="md"
    >
      <div className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            当前文件：<span className="font-medium">{file.displayName}</span>
          </p>
          <p className="text-xs text-gray-500">
            上传新文件将替换当前文件内容
          </p>
        </div>
        <UploadForm reuploadFileId={file.id} onSuccess={handleSuccess} />
      </div>
    </Modal>
  );
}
