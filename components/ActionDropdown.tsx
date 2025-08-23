import { BaseButtonIcon, BaseDropdown } from "@glint-ui/react";
import { EllipsisIcon } from "lucide-react";

export const ActionDropdown = ({ children }) => {
  return (
    <BaseDropdown
      renderButton={<BaseButtonIcon size="sm" rounded="full" className="h-5 w-5">
        <EllipsisIcon></EllipsisIcon>
      </BaseButtonIcon>}
    >
      {children}
    </BaseDropdown>
  );
};
