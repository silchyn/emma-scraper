export interface Bid {
  id: string;
  title: string;
  dueDate: string;
  summary: string;
  category: string;
  type: string;
  attachments: Attachment[];
}

export interface Attachment {
  title: string;
  type: string;
  modificationDate: string;
  creationDate: string;
  validityEndDate: string;
  files: File[];
}

export interface File {
  name: string;
  link: string;
}
