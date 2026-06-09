import {
  IconBrandAdobe,
  IconBrandInstagram,
  IconMail,
} from '@tabler/icons-react';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { type NavigateFunction, useLocation, useNavigate } from 'react-router';
import { AdobeUrl, EmailUrl, InstagramUrl } from '~/config/SocialsConfig';
import Button from '../button/Button';
import LinkButton from '../linkButton/LinkButton';
import styles from './NavHeader.module.css';

export default function NavHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const instaProfilePic =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyb4lblhau3cQm_xs24wna3LYmTDP1hwO9rw&s';

  return (
    <div className={styles.header}>
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
            onKeyUp={() => navigate('/')}
          />
        </div>
        <div className={styles.nameTitle}>{t('Common.NameTitle')}</div>
        <RouteButton route='/' name={t('Home.Title')} navigate={navigate} />
        <RouteButton
          route='/about'
          name={t('About.Title')}
          navigate={navigate}
        />
        <RouteButton
          route='/portfolio'
          name={t('Portfolio.Title')}
          navigate={navigate}
        />
        <RouteButton
          route='/contact'
          name={t('Contact.Title')}
          navigate={navigate}
        />
      </div>
    </div>
  );
}

type IRouteButton = {
  route: string;
  name: string;
  navigate: NavigateFunction;
};
function RouteButton({ route, name, navigate }: IRouteButton) {
  const { pathname } = useLocation();
  const disabled = route === pathname;

  return (
    <Button
      className={disabled ? styles.currentRouteButton : styles.navButton}
      onClick={() => navigate(route)}
      disabled={disabled}
    >
      {name}
    </Button>
  );
}
