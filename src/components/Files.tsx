import { FC } from 'react';
import { File } from '@/typedefs';

interface Props {
  files: File[];
}

export const Files: FC<Props> = ({ files }) => (
  <section className="px-8 pt-8">
    <p className="text-xs text-gray-400">Files</p>

    <section className="flex flex-col">
      {files.map(({ name, link }) => (
        <a
          key={name}
          href={link}
          target="_blank"
          className="text-sky-600 hover:underline"
        >
          {name}
        </a>
      ))}
    </section>
  </section>
);
