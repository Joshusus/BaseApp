import { useTranslation } from 'react-i18next';
import styles from './NavHeader.module.css';
import { useNavigate } from 'react-router';
import Button from '../button/Button';
import {
  IconBrandAdobe,
  IconBrandInstagram,
  IconMail,
} from '@tabler/icons-react';

export default function NavHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const instaProfilePic =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyb4lblhau3cQm_xs24wna3LYmTDP1hwO9rw&s';

  return (
    <>
      <div className={styles.socialMediaList}>
        <IconBrandInstagram stroke={2} className={styles.socialMedia} />
        <IconBrandAdobe stroke={2} className={styles.socialMedia} />
        <IconMail stroke={2} className={styles.socialMedia} />
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
