"use client"
import React, { useState, useEffect } from 'react';
import { Modal } from './Base/Modal';
import { FileUploadComplete } from './FileUploadComplete';

interface FileUploadModalProps {
  files: Array<{
    id: number;
    name: string;
    displayName: string;
    size: bigint;
    mimeType: string;
  }>;
}

export function FileUploadModal({ files }: FileUploadModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (files.length > 0) {
      setIsOpen(true);
    }
  }, [files]);

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      title="上传完成"
      size="lg"
    >
      <FileUploadComplete files={files} />
    </Modal>
  );
}
