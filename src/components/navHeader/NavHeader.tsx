import { useTranslation } from 'react-i18next';
import styles from './NavHeader.module.css';
import { useNavigate } from 'react-router';
import Button from '../button/Button';
import {
  IconBrandAdobe,
  IconBrandInstagram,
  IconMail,
} from '@tabler/icons-react';
import { AdobeUrl, EmailUrl, InstagramUrl } from '~/config/SocialsConfig';
import LinkButton from '../linkButton/LinkButton';

export default function NavHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const instaProfilePic =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyb4lblhau3cQm_xs24wna3LYmTDP1hwO9rw&s';

  return (
    <>
      <div className={styles.socialMediaList}>
        <LinkButton href={InstagramUrl} className=''>
          <IconBrandInstagram stroke={2} className={styles.socialMedia} />
        </LinkButton>
        <LinkButton href={AdobeUrl} className=''>
          <IconBrandAdobe stroke={2} className={styles.socialMedia} />
        </LinkButton>
        <LinkButton href={EmailUrl} className=''>
          <IconMail stroke={2} className={styles.socialMedia} />
        </LinkButton>
      </div>
      <div className={styles.headerBar}>
        <div className={styles.allowOverflow}>
          <img
            src={instaProfilePic}
            alt={t('Common.ProfilePic')}
            className={styles.profilePic}
            onClick={() => navigate('/')}
          />
        </div>
        <div className={styles.nameTitle}>{t('Common.NameTitle')}</div>
        <Button className={styles.navButton} onClick={() => navigate('/about')}>
          About
        </Button>
        <Button
          className={styles.navButton}
          onClick={() => navigate('/portfolio')}
        >
          Portfolio
        </Button>
        <Button
          className={styles.navButton}
          onClick={() => navigate('/contact')}
        >
          Contact
        </Button>
      </div>
    </>
  );
}
