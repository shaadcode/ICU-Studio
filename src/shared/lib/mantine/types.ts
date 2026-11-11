/* eslint-disable ts/consistent-type-definitions */
import type modals from '@/app/modals';

declare module '@mantine/modals' {
  export interface MantineModalsOverride {
    modals: typeof modals;
  }
  export interface ContextModalProps {
    // @ts-expect-error
    innerProps?: any;
  }
}
