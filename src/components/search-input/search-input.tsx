'use client';

import styles from './search-input.module.css';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  value?: string;
  className?: string;
}

export function SearchInput({
  onSearch,
  placeholder = 'Buscar...',
  value,
  className = '',
}: SearchInputProps) {
  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      <label htmlFor="search-input" className={styles.visuallyHidden}>
        Buscar
      </label>
      <input
        id="search-input"
        value={value}
        type="search"
        onChange={(e) => onSearch(e.target.value)}
        placeholder={placeholder}
        className={`${styles.searchInput} ${styles['filter-input']}`}
        aria-label="Campo de búsqueda"
      />
      <button
        type="button"
        className={styles.searchButton}
        tabIndex={-1}
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </div>
  );
}

export default SearchInput;
