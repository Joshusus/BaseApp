export type Enquiry = { name: string; replyTo: string; subject: string; message: string };

export function buildDraft(enquiry: Enquiry) {
  const subject = enquiry.subject.replace(/[\r\n]/g, ' ').trim();
  const body = `${enquiry.message.trim()}\n\nFrom: ${enquiry.name.trim()}\nReply to: ${enquiry.replyTo.trim()}`;
  return { subject, body };
}

export function createMailto(recipient: string, enquiry: Enquiry) {
  const { subject, body } = buildDraft(enquiry);
  return `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function draftText(recipient: string, enquiry: Enquiry) {
  const { subject, body } = buildDraft(enquiry);
  return `To: ${recipient}\nSubject: ${subject}\n\n${body}`;
}

export function downloadDraft(text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'photography-enquiry.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
