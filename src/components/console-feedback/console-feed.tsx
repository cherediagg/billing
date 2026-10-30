import styles from './console-feed.module.css';

interface ConsoleFeedProps {
  children: React.ReactNode;
}

export function ConsoleFeed({children}: ConsoleFeedProps) {
  return (
    <div className={styles.console}>
      {children}
    </div>
  );
}

export default ConsoleFeed;
