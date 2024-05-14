import { Switch } from '@nextui-org/react';
import { LuMoon, LuSun } from 'react-icons/lu';
import { useTheme } from 'next-themes';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Switch
      defaultSelected={theme === 'light'}
      size="md"
      startContent={<LuSun />}
      endContent={<LuMoon />}
      onValueChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      Tema
    </Switch>
  );
}
