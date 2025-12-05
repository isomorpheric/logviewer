import type { FallbackProps } from "react-error-boundary";
import styles from "./ErrorFallback.module.css";

interface Props extends FallbackProps {
  title?: string;
  message?: string;
}

export const ErrorFallback = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
}: Props) => {
  return (
    <div role="alert" className={styles.root}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
    </div>
  );
};
