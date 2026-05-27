import styles from './LinkButton.module.css';

export type ILinkButton = {
  href: string;
} & React.ComponentPropsWithoutRef<'a'>;

export default function LinkButton({ href, children, ...props }: ILinkButton) {
  return (
    <a className={styles.button} href={href} {...props}>
      {children}
    </a>
  );
}
