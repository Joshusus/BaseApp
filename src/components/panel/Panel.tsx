import classNames from '~/helpers/classnames';
import styles from './Panel.module.css';

export type IPanel = {
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Panel({ className, children, ...props }: IPanel) {
  return (
    <div className={classNames(styles.panel, className ?? '')} {...props}>
      {children}
    </div>
  );
}
