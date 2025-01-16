import { cn } from '@/lib/utils';
import { Link as RouterLink } from 'react-router';


export const Link = ({ className, children, ...props }) => {
  return (
    <RouterLink
      className={cn('text-slate-600 hover:text-slate-900', className)}
      {...props}
    >
      {children}
    </RouterLink>
  );
};
