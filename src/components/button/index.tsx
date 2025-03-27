import { type FC, type ReactNode, } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import styles from './style.module.scss'

type Props = {
  title?: string;
  url?: string;
  variant: 'primary' | 'secondary'
  className?: string | ' '
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => void
  children?: ReactNode
  type?: 'button' | 'submit' | 'reset'
}

const Button: FC<Props> = ({ title, url, variant, className, onClick, children, type }) => {

  const buttonClasses = clsx(
    styles.button,
    styles[variant],
    className,
  )

  return url ? (
    <Link href={url} passHref legacyBehavior className={buttonClasses}>
      {title} {children}
    </Link>
  ) : (
    <button className={buttonClasses} onClick={onClick} type={type}>
      {title} {children}
    </button>
  );
};

export default Button;