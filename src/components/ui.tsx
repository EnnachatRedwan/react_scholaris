import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

/* ── Spinner ── */
export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const s = { sm: 'h-5 w-5 border-2', md: 'h-8 w-8 border-4', lg: 'h-12 w-12 border-4' }[size];
  return <div className={`inline-block ${s} animate-spin rounded-full border-gray-200 dark:border-gray-600 border-t-blue-600`} />;
};

/* ── Alert ── */
export const Alert = ({ children }: { children: ReactNode }) => (
  <div className="flex items-start gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
    <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
    <span>{children}</span>
  </div>
);

/* ── Button ── */
type BtnVariant = 'primary' | 'danger' | 'ghost' | 'icon' | 'icon-danger';
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
}
export const Btn = ({ variant = 'primary', className = '', children, ...props }: BtnProps) => {
  const base = 'inline-flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants: Record<BtnVariant, string> = {
    primary:      'px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 active:bg-blue-800',
    danger:       'px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 active:bg-red-800',
    ghost:        'px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm hover:bg-gray-200 dark:hover:bg-gray-600',
    icon:         'p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
    'icon-danger':'p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

/* ── Form fields ── */
const fieldCls = 'block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500';

export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={fieldCls} {...props} />
);

export const Textarea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={`${fieldCls} resize-none`} {...props} />
);

export const Select = ({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) => (
  <select className={fieldCls} {...props}>{children}</select>
);

export const Label = ({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    {children}
  </label>
);

/* ── Card ── */
export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 ${className}`}>
    {children}
  </div>
);

/* ── Table primitives ── */
export const Table = ({ children }: { children: ReactNode }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
    <table className="w-full text-sm">{children}</table>
  </div>
);
export const Thead = ({ children }: { children: ReactNode }) => (
  <thead className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">{children}</thead>
);
export const Th = ({ children, className = '' }: { children?: ReactNode; className?: string }) => (
  <th className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ${className}`}>{children}</th>
);
export const Tbody = ({ children }: { children: ReactNode }) => (
  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">{children}</tbody>
);
export const Tr = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <tr className={`bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors ${className}`}>{children}</tr>
);
export const Td = ({ children, className = '' }: { children?: ReactNode; className?: string }) => (
  <td className={`px-4 py-3 text-gray-700 dark:text-gray-300 ${className}`}>{children}</td>
);

/* ── Empty state ── */
export const Empty = ({ message }: { message: string }) => (
  <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-12 text-center">
    <p className="text-gray-400 dark:text-gray-500">{message}</p>
  </div>
);
