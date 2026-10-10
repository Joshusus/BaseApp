import classNames from '~/helpers/classNames';
import styles from './KeyTextBlock.module.css';

export type IKeyTextBlock = {
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export default function KeyTextBlock({ className, children, ...props }: IKeyTextBlock) {
  return (
    <div className={classNames(styles.keyTextBlock, className ?? '')} {...props}>
      {children}
    </div>
  );
}
