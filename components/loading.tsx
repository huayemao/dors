import { cn } from "@/lib/utils";
import styles from "@/styles/loading.module.css";
export default function Loading({ className }: { className?: string }) {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div
      className={cn(
        "h-full w-full min-h-[75vh] flex items-center justify-center", 
        className
      )}
    >
      <div className={styles.container}>
        <span className={styles.item}></span>
        <span className={styles.item}></span>
        <span className={styles.item}></span>
        <span className={styles.item}></span>
      </div>
    </div>
  );
}
