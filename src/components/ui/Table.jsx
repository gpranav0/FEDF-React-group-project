import React from 'react';
import { cn } from '../../utils/cn';

export function Table({ className, children, ...props }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className={cn("w-full text-sm text-left text-slate-500", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function Thead({ className, children, ...props }) {
  return (
    <thead className={cn("text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200", className)} {...props}>
      {children}
    </thead>
  );
}

export function Tbody({ className, children, ...props }) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
}

export function Tr({ className, children, ...props }) {
  return (
    <tr className={cn("border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0", className)} {...props}>
      {children}
    </tr>
  );
}

export function Th({ className, children, ...props }) {
  return (
    <th scope="col" className={cn("px-6 py-4 font-semibold", className)} {...props}>
      {children}
    </th>
  );
}

export function Td({ className, children, ...props }) {
  return (
    <td className={cn("px-6 py-4 whitespace-nowrap", className)} {...props}>
      {children}
    </td>
  );
}
