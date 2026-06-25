import { useTranslation } from 'react-i18next';

import Logo from '@/components/Logo';
import UserMenu from '@/components/UserMenu';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="px-8 h-16 flex items-center justify-between">

        <Logo title={t('header.title', { defaultValue: 'Admin Panel' })} />

        <UserMenu />

      </div>
    </header>
  );
}
