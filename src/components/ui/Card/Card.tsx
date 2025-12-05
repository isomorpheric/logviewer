import { clsx } from "clsx";
import type { ReactNode } from "react";
import styles from "./Card.module.css";

export interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = ({ children, className, padding = "md" }: CardProps) => {
  return (
    <div className={clsx(styles.card, styles[`padding-${padding}`], className)}>{children}</div>
  );
};
