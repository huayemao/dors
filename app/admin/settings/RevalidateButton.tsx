"use client"
export function RevalidateButton() {
  return (
    <button
      onClick={() => {
        fetch("/api/revalidate?path=/");
        fetch("/api/revalidate?path=/(home)");
      }}
    >
      重新渲染首页
    </button>
  );
}
