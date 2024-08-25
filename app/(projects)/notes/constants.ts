export const DEFAULT_NOTE = {
  seq: "0",
  id: Date.now(),
  content: "",
  tags: [] as string[],
  updatedAt: Date.now()
};

export const DEFAULT_COLLECTION = {
  id: 1100,
  name: new Date().toLocaleDateString(),
  online: false
};


export type Note = typeof DEFAULT_NOTE