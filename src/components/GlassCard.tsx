import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function GlassCard({ children, className, hover = true, delay = 0, ...rest }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={hover ? { y: -3 } : undefined}
      className={cn('glass-card shadow-card p-5', hover && 'glass-card-hover', className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
