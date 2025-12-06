import { useMemo } from "react";
import type { LogEntry } from "@/types";
import styles from "./Timeline.module.css";
import {
  assignLogsToBuckets,
  calculateYAxisTicks,
  createTimeBuckets,
  formatAxisTime,
  getTimeRange,
} from "./utils";

interface Props {
  logs: LogEntry[];
  bucketCount?: number;
  height?: number;
}

export const Timeline = ({ logs, bucketCount = 8, height = 120 }: Props) => {
  const chartData = useMemo(() => {
    const timeRange = getTimeRange(logs);
    if (!timeRange) return null;

    const buckets = createTimeBuckets(timeRange.min, timeRange.max, bucketCount);
    const bucketedData = assignLogsToBuckets(logs, buckets);
    const maxCount = Math.max(...bucketedData.map((d) => d.count), 0);
    const yTicks = calculateYAxisTicks(maxCount, 5);
    const actualMax = yTicks[yTicks.length - 1] || 1;

    return { bucketedData, yTicks, maxCount: actualMax };
  }, [logs, bucketCount]);

  if (!chartData || logs.length === 0) {
    return (
      <div
        className={styles.container}
        style={{ height }}
        role="img"
        aria-label="Timeline of log events"
      >
        <div className={styles.empty}>No data to display</div>
      </div>
    );
  }

  const { bucketedData, yTicks, maxCount } = chartData;

  return (
    <div
      className={styles.container}
      style={{ height }}
      role="img"
      aria-label="Timeline of log events"
    >
      {/* Y-Axis */}
      <div className={styles.yAxis}>
        {yTicks
          .slice()
          .reverse()
          .map((tick, idx) => {
            const key = `y-tick-${yTicks.length - 1 - idx}-${tick}`;
            return (
              <span key={key} className={styles.yTick}>
                {tick}
              </span>
            );
          })}
      </div>

      {/* Chart Area */}
      <div className={styles.chartArea}>
        {/* Grid lines */}
        <div className={styles.gridLines}>
          {yTicks.slice(0, -1).map((_, idx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Static grid lines never reorder
            <div key={`grid-${idx}`} className={styles.gridLine} />
          ))}
        </div>

        {/* Bars */}
        <div className={styles.bars}>
          {bucketedData.map((data) => {
            const heightPercent = maxCount > 0 ? (data.count / maxCount) * 100 : 0;
            return (
              <div key={data.bucket.start} className={styles.barColumn}>
                <div
                  className={styles.bar}
                  style={{ height: `${heightPercent}%` }}
                  title={`${data.count} events`}
                />
              </div>
            );
          })}
        </div>

        {/* X-Axis */}
        <div className={styles.xAxis}>
          {bucketedData.map((data) => (
            <span key={data.bucket.start} className={styles.xTick}>
              {formatAxisTime(data.bucket.start)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
