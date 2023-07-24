export type Question = {
  id: number;
  seq: string;
  type: string;
  content: string;
  answer: string;
  solution: string;
  options: Option[];
};

export type Option = {
  label: string;
  value: string;
};
