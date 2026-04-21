import styles from './Panel.module.css';

export type IPanel = { children: React.ReactNode };

export default function Panel({ children }: IPanel) {
  return <div className={styles.panel}>{children}</div>;
}
