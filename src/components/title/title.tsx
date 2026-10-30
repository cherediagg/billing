import styles from './title.module.css';

interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

export function Title({children, className} : TitleProps) {
  return (
    <h1 className={`${styles.title} ${className || ''}`.trim()}>
      {children}
    </h1>
  );
}

export default Title;
