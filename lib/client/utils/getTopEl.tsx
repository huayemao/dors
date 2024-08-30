"use client";
export function getTopEl(el: HTMLElement) {
  let e = el;
  while (e && e.parentElement) {
    e = e.parentElement;
  }
  return e;
}
