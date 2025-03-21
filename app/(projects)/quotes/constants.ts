import { BaseEntity } from "@/lib/client/createEntity/types";

export interface Quote extends BaseEntity {
  wordlist: string;
  translation: string;
  quote: string;
  artwork: string;
  image: string;
}

export const DEFAULT_QUOTE: Quote = {
  seq: "0",
  id: Date.now(),
  wordlist: "",
  translation: "",
  quote: "",
  artwork: "",
  image: ""
};


export const DEFAULT_COLLECTION = {
  id: Date.now(),
  name: new Date().toLocaleDateString(),
  online: false
};

