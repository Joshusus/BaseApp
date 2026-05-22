import styles from './Panel.module.css';

export type IPanel = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Panel({ children, ...props }: IPanel) {
  return (
    <div className={styles.panel} {...props}>
      {children}
    </div>
  );
}
