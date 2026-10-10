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
  const [subject, setSubject] = useState(() =>
    params.get('photo')
      ? t('Contact.PhotoEnquirySubject', { album: params.get('album') || t('Portfolio.Title') })
      : t('Contact.EnquirySubject'),
  );
  const [message, setMessage] = useState(() =>
    params.get('photo')
      ? t('Contact.PhotoEnquiryMessage', {
          album: params.get('album') || t('Portfolio.Title'),
          photo: params.get('photo'),
        })
      : t(siteConfig.enquiryStarter),
  );
  const [feedback, setFeedback] = useState('');
  const [showCopy, setShowCopy] = useState(false);
  const enquiry = { name, replyTo, subject, message };
  const text = draftText(siteConfig.email, enquiry, t);
  const valid = (form: HTMLFormElement) => form.reportValidity();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const href = createMailto(siteConfig.email, enquiry, t);
    if (href.length > 1800) {
      setFeedback('Contact.Feedback.TooLong');
      setShowCopy(true);
      return;
    }
    window.location.href = href;
    setFeedback('Contact.Feedback.Opened');
  };
  const copy = async (form: HTMLFormElement) => {
    if (!valid(form)) return;
    try {
      await navigator.clipboard.writeText(text);
      setFeedback('Contact.Feedback.Copied');
    } catch {
      setShowCopy(true);
      setFeedback('Contact.Feedback.CopyUnavailable');
    }
  };
  return (
    <PageContent pageTitle={t('Contact.Title')}>
      <NavHeader />
      <main id="main-content" className="section">
        <div className="page-intro">
          <p className="eyebrow">{t('Contact.Eyebrow')}</p>
          <h1>{t('Contact.Heading')}</h1>
          <p>{t('Contact.Introduction')}</p>
        </div>
        <div className={styles.layout}>
          <aside>
            <h2>{t('Contact.AsideHeading')}</h2>
            <p>{t('Contact.AsideBody')}</p>
            <div className={styles.contactDetail}>
              <span>{t('Contact.EmailLabel')}</span>
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </div>
            <a className="text-link" href={siteConfig.instagram} target="_blank" rel="noreferrer">
              <IconBrandInstagram size={20} /> {t('Contact.InstagramLink')}
            </a>
            <div className={styles.note}>
              <p>{t('Contact.DraftNotice')}</p>
              <p>{t('Contact.PrivacyNotice')}</p>
            </div>
          </aside>
          <form className={styles.form} onSubmit={submit}>
            {isTestEmail && <p className="demo-note">{t('Contact.PreviewNotice')}</p>}
            <div className={styles.fields}>
              <label>
                {t('Contact.Fields.Name')}
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
                {t('Contact.Fields.Email')}
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
              {t('Contact.Fields.Subject')}
              <input
                name="subject"
                required
                maxLength={150}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </label>
            <label>
              {t('Contact.Fields.Message')}
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
                {t('Contact.OpenDraft')} <IconArrowUpRight size={20} />
              </button>
              <button
                className="button"
                type="button"
                onClick={(event) => {
                  void copy(event.currentTarget.form!);
                }}
              >
                <IconCopy size={18} /> {t('Contact.CopyDraft')}
              </button>
              <button
                className="button"
                type="button"
                onClick={(event) => {
                  if (valid(event.currentTarget.form!)) {
                    downloadDraft(text);
                    setFeedback('Contact.Feedback.Downloaded');
                  }
                }}
              >
                <IconDownload size={18} /> {t('Contact.Download')}
              </button>
            </div>
            <p role="status" className={styles.feedback}>
              {feedback && t(feedback)}
            </p>
            {showCopy && (
              <label>
                {t('Contact.DraftToCopy')}
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
