import { FC } from 'react';
import { clsx } from 'clsx';

interface Props {
  title: string;
  content?: string;
  long?: boolean;
}

export const Field: FC<Props> = ({ title, content, long }) => (
  <section className="px-8 pt-8">
    <p className="text-xs text-gray-400">{title}</p>
    {content && (
      <p className={clsx({ 'text-justify': long })}>{content}</p>
    )}
  </section>
);
