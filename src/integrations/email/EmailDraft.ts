import type { TFunction } from 'i18next';
export type Enquiry = { name: string; replyTo: string; subject: string; message: string };

export function buildDraft(enquiry: Enquiry, t: TFunction) {
  const subject = enquiry.subject.replace(/[\r\n]/g, ' ').trim();
  const body = t('Contact.Draft.Body', {
    message: enquiry.message.trim(),
    name: enquiry.name.trim(),
    replyTo: enquiry.replyTo.trim(),
    interpolation: { escapeValue: false },
  });
  return { subject, body };
}

export function createMailto(recipient: string, enquiry: Enquiry, t: TFunction) {
  const { subject, body } = buildDraft(enquiry, t);
  return `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function draftText(recipient: string, enquiry: Enquiry, t: TFunction) {
  const { subject, body } = buildDraft(enquiry, t);
  return t('Contact.Draft.Text', {
    recipient,
    subject,
    body,
    interpolation: { escapeValue: false },
  });
}

export function downloadDraft(text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'photography-enquiry.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
