'use client';

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { createLocalizedHref, type Locale } from '../../lib/navigation';

interface LocalizedLinkProps extends Omit<LinkProps, 'href'> {
  href: string;
  locale?: Locale;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export const LocalizedLink: React.FC<LocalizedLinkProps> = ({
  href,
  locale,
  children,
  className,
  target,
  rel,
  ...props
}) => {
  const localizedHref = createLocalizedHref(href, locale);
  const isExternalLink = href.startsWith('http') || href.startsWith('//');
  const linkRel = isExternalLink ? rel || 'noopener noreferrer' : rel;
  
  return (
    <Link
      href={localizedHref}
      className={className}
      target={target}
      rel={linkRel}
      {...props}
    >
      {children}
    </Link>
  );
};

export default LocalizedLink; 