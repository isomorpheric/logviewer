import { clsx } from "clsx";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.css";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "className" | "style"> {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  style?: CSSProperties;
}

export const Card = ({ children, className, padding = "md", style, ...rest }: CardProps) => {
  return (
    <div
      className={clsx(styles.card, styles[`padding-${padding}`], className)}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
};
