import styles from './PageContent.module.css';

export type IPageContent = {
  children: React.ReactNode;
  pageTitle?: string;
};

export default function PageContent({ pageTitle, children }: IPageContent) {
  return (
    <div className={styles.page}>
      <div className={styles.pageTitle}>{pageTitle}</div>
      <div>{children}</div>
    </div>
  );
}
