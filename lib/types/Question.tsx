export type Question = {
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
