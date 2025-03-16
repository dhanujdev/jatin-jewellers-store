import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="mb-8" aria-label="Breadcrumb">
      <ol className="flex text-sm">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <li className="mx-2 text-gray-500">/</li>
            )}
            <li className={index === items.length - 1 ? 'text-gray-800' : 'mr-2'}>
              {item.href ? (
                <Link href={item.href} className="text-gray-500 hover:text-gold">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-800">{item.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
} 