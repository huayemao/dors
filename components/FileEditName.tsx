import { useState } from "react";
import { BaseButton, BaseInput } from "@glint-ui/react";
import { Modal } from "./Base/Modal";

interface FileEditNameProps {
  file?: {
    id: number;
    name: string;
    displayName: string;
  } | null;
  onUpdate: (newName: string) => void;
}

export function FileEditName({
  file,
  onUpdate,
}: FileEditNameProps) {
  const [newName, setNewName] = useState(file?.displayName || file?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newName.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/files/${file?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ displayName: newName.trim() }),
      });

      if (response.ok) {
        onUpdate(newName.trim());
      } else {
        const error = await response.text();
        alert(error);
      }
    } catch (error) {
      alert("更新失败: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!file) return null;

  return (
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">修改文件名</h3>
        <BaseInput
          value={newName}
          onChange={(e: string) => setNewName(e)}
          placeholder="请输入新的文件名"
          className="mb-4"
        />
        <div className="flex justify-end gap-2">
          <BaseButton
            onClick={handleSubmit}
            color="primary"
            loading={isLoading}
            disabled={!newName.trim()}
          >
            保存
          </BaseButton>
        </div>
      </div>
  );
}
