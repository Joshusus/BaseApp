import { useTranslation } from 'react-i18next';
import styles from './NavHeader.module.css';
import { useNavigate } from 'react-router';
import Button from '../button/Button';

export default function NavHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.socialMediaList}>
        <>A</> <>B</> <>C</>
      </div>
      <div className={styles.headerBar}>
        <div className={styles.allowOverflow}>
          <img
            src='./photos/ProfilePic.png'
            alt={t('Common.ProfilePic')}
            className={styles.profilePic}
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
