import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { IconArrowUpRight, IconCopy, IconDownload, IconBrandInstagram } from '@tabler/icons-react';
import PageContent from '~/components/pageContent/PageContent';
import NavHeader from '~/components/navHeader/NavHeader';
import { isTestEmail, siteConfig } from '~/config/SiteConfig';
import { createMailto, draftText, downloadDraft } from '~/integrations/email/EmailDraft';
import styles from './Contact.module.css';

export default function Contact() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const [name, setName] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [subject, setSubject] = useState(
    params.get('photo')
      ? `Photo enquiry: ${params.get('album') || 'Portfolio'}`
      : 'Photography enquiry',
  );
  const [message, setMessage] = useState(
    params.get('photo')
      ? `Hi Marcus,\n\nI’m interested in this photograph:\nAlbum: ${params.get('album') || 'Portfolio'}\nPhoto reference: ${params.get('photo')}\n\nCould you tell me more about prints or licensing?\n\nThanks!`
      : siteConfig.enquiryStarter,
  );
  const [feedback, setFeedback] = useState('');
  const [showCopy, setShowCopy] = useState(false);
  const enquiry = { name, replyTo, subject, message };
  const text = draftText(siteConfig.email, enquiry);
  const valid = (form: HTMLFormElement) => form.reportValidity();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const href = createMailto(siteConfig.email, enquiry);
    if (href.length > 1800) {
      setFeedback(
        'This draft is too long for some email apps. Copy or download it below, then paste it into your email.',
      );
      setShowCopy(true);
      return;
    }
    window.location.href = href;
    setFeedback(
      'Your email app was requested. Nothing has been sent by this website. Review the draft and send it there. If no app opened, copy or download your draft below.',
    );
  };
  const copy = async (form: HTMLFormElement) => {
    if (!valid(form)) return;
    try {
      await navigator.clipboard.writeText(text);
      setFeedback('Draft copied. Paste it into your email and send it to the address shown.');
    } catch {
      setShowCopy(true);
      setFeedback('Automatic copying is unavailable. Select and copy the draft below.');
    }
  };
  return (
    <PageContent pageTitle={t('Contact.Title')}>
      <NavHeader />
      <main id="main-content" className="section">
        <div className="page-intro">
          <p className="eyebrow">LET’S MAKE SOMETHING MEMORABLE</p>
          <h1>What’s your next move?</h1>
          <p>An event. A team. A personal best. Tell Marcus what you have in mind.</p>
        </div>
        <div className={styles.layout}>
          <aside>
            <h2>Start a conversation.</h2>
            <p>
              Share a few details about your project, date and location. Or ask about a photograph
              you’ve spotted in the portfolio.
            </p>
            <div className={styles.contactDetail}>
              <span>EMAIL</span>
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </div>
            <a className="text-link" href={siteConfig.instagram} target="_blank" rel="noreferrer">
              <IconBrandInstagram size={20} /> Find Marcus on Instagram
            </a>
            <div className={styles.note}>
              <p>This form prepares a draft in your email app. You review and send it yourself.</p>
              <p>
                Your message stays in this page until you open your email app, copy it or download
                it. The website does not submit or store enquiries.
              </p>
            </div>
          </aside>
          <form className={styles.form} onSubmit={submit}>
            {isTestEmail && (
              <p className="demo-note">
                Preview contact address · marcus@example.com is a placeholder and cannot receive
                enquiries. Use Marcus’s Instagram to get in touch for now.
              </p>
            )}
            <div className={styles.fields}>
              <label>
                Your name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                Your email
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={replyTo}
                  onChange={(e) => setReplyTo(e.target.value)}
                />
              </label>
            </div>
            <label>
              Subject
              <input
                name="subject"
                required
                maxLength={150}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </label>
            <label>
              Your message
              <textarea
                name="message"
                required
                rows={10}
                maxLength={10000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>
            <div className={styles.actions}>
              <button className="button button-primary" type="submit">
                Open email draft <IconArrowUpRight size={20} />
              </button>
              <button
                className="button"
                type="button"
                onClick={(event) => {
                  void copy(event.currentTarget.form!);
                }}
              >
                <IconCopy size={18} /> Copy draft
              </button>
              <button
                className="button"
                type="button"
                onClick={(event) => {
                  if (valid(event.currentTarget.form!)) {
                    downloadDraft(text);
                    setFeedback('Draft downloaded. Paste its contents into your email to send it.');
                  }
                }}
              >
                <IconDownload size={18} /> Download
              </button>
            </div>
            <p role="status" className={styles.feedback}>
              {feedback}
            </p>
            {showCopy && (
              <label>
                Draft to copy
                <textarea
                  readOnly
                  rows={10}
                  value={text}
                  onFocus={(event) => event.currentTarget.select()}
                />
              </label>
            )}
          </form>
        </div>
      </main>
    </PageContent>
  );
}
