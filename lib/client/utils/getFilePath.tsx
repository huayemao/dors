"use client";
import { SITE_META } from "@/constants";

export const getFilePath = (name: string) => `${SITE_META.url}/api/files/${name}`;
