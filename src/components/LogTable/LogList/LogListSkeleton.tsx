import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import styles from "./LogListSkeleton.module.css";

const SKELETON_ROW_COUNT = 10;

export const LogListSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton rows never reorder
        <div key={index} className={styles.skeletonRow}>
          <LoadingSkeleton width="var(--col-time-width)" height="1em" />
          <LoadingSkeleton height="1em" className={styles.skeletonEvent} />
        </div>
      ))}
    </div>
  );
};
