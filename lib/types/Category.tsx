export type Cat = {
  hidden: boolean;
  id: number;
  name: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  published_at: Date | null;
  created_by_id: number | null;
  updated_by_id: number | null;
  meta?: { icon: string; description: string; sortIndex?: number };
  postCount?: number;
};
