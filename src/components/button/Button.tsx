import styles from './Button.module.css';

export type IButton = {
  onClick: () => void;
} & React.ComponentPropsWithoutRef<'button'>;

export default function Button({ onClick, children, ...props }: IButton) {
  return (
    <button className={styles.button} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
