import { openUrl } from '@tauri-apps/plugin-opener';
import { Avatar, useMantineColorScheme } from '@mantine/core';

import { ICU_STUDIO_WEBSITE } from '@/shared/lib/icu';
import darkLogo from '@/assets/logo/icu-studio-dark-logo.png';
import lightLogo from '@/assets/logo/icu-studio-light-logo.png';

const Logo = () => {
  const { colorScheme } = useMantineColorScheme();
  const handleLogoClick = async () => {
    await openUrl(ICU_STUDIO_WEBSITE);
  };
  return (
    <Avatar
      component="button"
      alt="ICU Studio Logo"
      style={{ cursor: 'pointer' }}
      src={colorScheme === 'light' ? lightLogo : darkLogo}

      onClick={handleLogoClick}
    />
  );
};

export default Logo;
