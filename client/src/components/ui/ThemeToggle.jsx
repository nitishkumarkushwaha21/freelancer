import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme, isLight } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle group relative flex h-9 w-[4.25rem] shrink-0 items-center rounded-full border border-[var(--line)] bg-[var(--bg-alt)] p-1 transition-all duration-300 hover:border-[var(--red)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--neon)]"
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
    >
      <span
        className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-[var(--red)] shadow-sm transition-transform duration-300 ease-out ${
          isLight ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
        }`}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-1.5 text-[11px] leading-none text-[var(--gray)]">
        <span className={`transition-opacity duration-200 ${isLight ? 'opacity-35' : 'opacity-100'}`}>
          ☾
        </span>
        <span className={`transition-opacity duration-200 ${isLight ? 'opacity-100' : 'opacity-35'}`}>
          ☀
        </span>
      </span>
      <span className="sr-only">Current theme: {theme}</span>
    </button>
  );
}
