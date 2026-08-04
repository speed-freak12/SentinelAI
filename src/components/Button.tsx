import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className,
  ...rest
}: ButtonProps) {
  const variants = {
    primary:
      'bg-gradient-to-r from-accent-blue to-accent-cyan text-white shadow-glow hover:shadow-glow-cyan',
    ghost: 'bg-white/[0.03] text-slate-200 hover:bg-white/[0.06] border border-white/[0.06]',
    outline: 'border border-white/15 text-slate-200 hover:bg-white/[0.04]',
    danger: 'bg-gradient-to-r from-accent-red to-rose-600 text-white shadow-glow-red',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-sm rounded-xl gap-2.5',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      {icon}
      {children}
    </motion.button>
  );
}
