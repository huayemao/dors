export const DEFAULT_OPTIONS = [
  {
    label: "A",
    value: "",
  },
  {
    label: "B",
    value: "",
  },
  {
    label: "C",
    value: "",
  },
  {
    label: "D",
    value: "",
  },
];

export const DEFAULT_QUESTION = {
  seq: "0",
  id: Date.now(),
  content: "",
  type: "single",
  solution: "",
  answer: "A",
  options: ["A", "B", "C", "D"].map((e) => ({
    label: e,
    value: "",
  })),
};

export const DEFAULT_COLLECTION = {
  id: Date.now(),
  name: new Date().toLocaleDateString(),
  online: false
};
