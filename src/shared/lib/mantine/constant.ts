import type { TreeNodeData } from '@mantine/core';
import type { Location } from '@formatjs/icu-messageformat-parser';

import type { MessageElementsTypeKeyword } from '../icu/types';
import type { TraverseContext } from '../icu/createHtml/createHtml';

export const DEBOUNCE_UPDATE_EDITOR = 300;
export const TEST_VARIABLES_ACCORDION_TRANSITION_DURATION = 250;
export const MOBILE_BREAKPOINT = 'sm';
export const TABLET_BREAKPOINT = 'lg';

export const createTreeNodeData = () => ({
  label: '',
  value: '',
  referenceId: '',
  location: {} as Location,
  children: [] as Array<TreeNodeData>,
  type: '' as 'plural-option' | 'select-option' | 'selectordinal-option' | MessageElementsTypeKeyword,
});

export type MessageOutlineData = ReturnType<typeof createTreeNodeData>;

export const createTreeNodePath = (
  ctx: TraverseContext,
  currentType: ReturnType<typeof createTreeNodeData>['type'],
) => `${ctx.parentType}/${ctx.childIndex}/${currentType}`;
