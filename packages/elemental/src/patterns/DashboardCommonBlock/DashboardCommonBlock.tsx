import React from "react";
import styles from "./DashboardCommonBlock.module.scss";

export type DashboardCommonBlockProps = {
  title: string;
  children?: React.ReactNode;
  className?: string;
};

/**
 * Reference implementation for dashboard stat cards (`common-block` in UI-web).
 * Visual spec: no shadow, 8px radius, 1px border using DS CSS variables.
 */
export function DashboardCommonBlock({
  title,
  children,
  className,
}: DashboardCommonBlockProps) {
  return (
    <div className={`${styles.card} ${className ?? ""}`.trim()}>
      <h3 className={styles.heading}>{title}</h3>
      {children}
    </div>
  );
}
