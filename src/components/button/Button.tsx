import classNames from '~/helpers/classnames';
import styles from './Button.module.css';

export type IButton = {
  onClick: () => void;
  disabled?: boolean;
} & React.ComponentPropsWithoutRef<'button'>;

export default function Button({
  onClick,
  disabled,
  children,
  ...props
}: IButton) {
  const classNamesList = [styles.button];
  if (disabled) classNamesList.push(styles.disabled);

  return (
    <button
      className={classNames(...classNamesList)}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
