import { Attachment } from '@/typedefs';
import { FC, Fragment } from 'react';
import { Files } from '@/components/Files';
import { Field } from '@/components/Field';

interface Props {
  attachments: Attachment[];
}

export const Attachments: FC<Props> = ({ attachments }) => {
  return (
    <>
      <Field title="Attachments" />

      {attachments.map(({
        title,
        type,
        files,
        modificationDate,
        creationDate,
        validityEndDate,
      }) => (
        <Fragment key={title}>
          <hr className="border-gray-100 mt-8" />
          {title && <Field title="Title" content={title} long />}
          {type && <Field title="Type" content={type} />}
          {files.length > 0 && <Files files={files} />}
          {modificationDate && (
            <Field title="Modification date" content={modificationDate} />
          )}
          {creationDate && (
            <Field title="Creation date" content={creationDate} />
          )}
          {validityEndDate && (
            <Field title="Validity end date" content={validityEndDate} />
          )}
        </Fragment>
      ))}
    </>
  );
};
