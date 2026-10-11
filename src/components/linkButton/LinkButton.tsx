import classNames from '~/helpers/classNames';
import styles from './LinkButton.module.css';

export type ILinkButton = {
  href: string;
} & React.ComponentPropsWithoutRef<'a'>;

export default function LinkButton({ href, className, children, ...props }: ILinkButton) {
  return (
    <a className={classNames(styles.button, className ?? '')} href={href} {...props}>
      {children}
    </a>
  );
}
