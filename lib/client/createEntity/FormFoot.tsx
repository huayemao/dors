import { BaseButton } from "@shuriken-ui/react";
import { useCloseModal } from "../hooks/useCloseModal";

export function FormFoot() {
  const close = useCloseModal();
  return (
    <div className="sticky p-4 md:p-6 flex w-full items-center  gap-x-2 justify-end -bottom-4 left-0 right-0">
      <BaseButton
        onClick={(e) => {
          e.preventDefault();
          close();
        }}
        type="button"
      >
        取消
      </BaseButton>
      <BaseButton type="submit" variant="solid" color="primary" size="md">
        确定
      </BaseButton>
    </div>
  );
}
