import styles from "@/styles/loading.module.css";
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className={styles.container}>
        <span className={styles.item}></span>
        <span className={styles.item}></span>
        <span className={styles.item}></span>
        <span className={styles.item}></span>
      </div>
    </div>
  );
}
