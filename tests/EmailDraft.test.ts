import { describe, expect, it } from 'vitest';
import { createMailto, draftText } from '../src/integrations/email/EmailDraft';
describe('email draft composition', () => {
  it('encodes unicode, newlines and URL/header delimiters without truncating the message', () => {
    const enquiry = {
      name: 'Jo',
      replyTo: 'jo@example.com',
      subject: 'Water & sport? #1\r\nBcc: nope',
      message: 'Hi Marcus,\nDéjà vu & 100% effort?',
    };
    const uri = createMailto('marcus@example.com', enquiry);
    const query = new URLSearchParams(uri.split('?')[1]);
    expect(query.get('subject')).toBe('Water & sport? #1  Bcc: nope');
    expect(query.get('body')).toBe(
      'Hi Marcus,\nDéjà vu & 100% effort?\n\nFrom: Jo\nReply to: jo@example.com',
    );
    expect(query.has('bcc')).toBe(false);
  });
  it('includes destination, subject and contact details in the portable draft', () => {
    expect(
      draftText('marcus@example.com', {
        name: '  Jo  ',
        replyTo: 'jo@example.com',
        subject: 'Event coverage',
        message: '  Next Saturday  ',
      }),
    ).toBe(
      'To: marcus@example.com\nSubject: Event coverage\n\nNext Saturday\n\nFrom: Jo\nReply to: jo@example.com',
    );
  });
});
