"use client";

export default  function AdminSettingsPage({ params }) {
  return (
    <main className="w-full px-8 py-4">
      <section className="flex flex-col gap-2 w-36 items-start">
        <button
          onClick={() => {
            fetch("/api/revalidate?path=/");
          }}
        >
          重新渲染首页
        </button>
        <button
          onClick={() => {
            fetch("/api/revalidate?path=/(home)");
          }}
        >
          重新渲染首页1
        </button>
      </section>
    </main>
  );
}
