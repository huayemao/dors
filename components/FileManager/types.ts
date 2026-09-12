export interface FileGroupItem {
  id: number;
  name: string;
  color?: string | null;
  count: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface FileItem {
  id: number;
  name: string;
  displayName: string;
  size: bigint | number | string | null;
  mimeType: string;
  provider?: string;
  groupId?: number | null;
  group?: {
    id: number;
    name: string;
    color?: string | null;
  } | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface PostReference {
  id: number;
  title: string;
  slug?: string | null;
  type?: string;
  published_at?: string | Date | null;
  updated_at?: string | Date | null;
  isCover?: boolean;
  snippets: string[];
}

export interface ReferenceData {
  file: {
    id: number;
    name: string;
    displayName: string;
    mimeType: string;
    size?: string | null;
    group?: { id: number; name: string; color?: string | null } | null;
    createdAt?: string | Date;
  };
  totalReferences: number;
  posts: PostReference[];
}
