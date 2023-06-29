"use client";
import Carousel from "@/components/Carousel";
import styles from "@/styles/Home.module.css";

export default function Demo() {
  return (
    <div className={styles.container}>
      <details>
        <summary>问题</summary>
        回答
      </details>
      <div
        dangerouslySetInnerHTML={{
          __html: `
      <form oninput="result.value=parseInt(a.value)+parseInt(b.value)">
        <input type="range" id="b" name="b" value="50" /> +
        <input type="textarea" id="a" name="a" value="aa" /> =
        <output name="result" for="a b">60</output>
      </form>`,
        }}
      ></div>

      <main className={styles.main}>
        <Carousel></Carousel>
      </main>
    </div>
  );
}
