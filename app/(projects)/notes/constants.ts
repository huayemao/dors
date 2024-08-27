export const DEFAULT_NOTE = {
  seq: "0",
  id: Date.now(),
  content: "",
  tags: [] as string[],
  updatedAt: Date.now()
};

export const DEFAULT_COLLECTION = {
  id: Date.now(),
  name: new Date().toLocaleDateString(),
  online: false
};


export type Note = typeof DEFAULT_NOTE