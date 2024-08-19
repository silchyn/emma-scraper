import { Bid as BidData } from '@/typedefs';
import { FC } from 'react';
import { Attachments } from '@/components/Attachments';
import { Field } from '@/components/Field';

interface Props {
  bid: BidData;
}

export const Bid: FC<Props> = ({ bid }) => {
  const {
    id,
    title,
    dueDate,
    summary,
    category,
    type,
    attachments,
  } = bid;

  return (
    <>
      <Field title="ID" content={id} />
      <Field title="Title" content={title} long />
      {dueDate && <Field title="Due date" content={dueDate} />}
      {type && <Field title="Solicitation type" content={type} />}
      {category && <Field title="Main category" content={category} />}
      {summary && (
        <Field title="Solicitation summary" content={summary} long />
      )}
      {attachments.length > 0 && <Attachments attachments={attachments} />}
    </>
  );
};
