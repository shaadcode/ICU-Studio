import { useState } from 'react';
import { useTranslations } from 'use-intl';
import { useDebouncedCallback } from '@mantine/hooks';
import { Box, Tabs, Stack, ScrollArea } from '@mantine/core';

import classes from './Navbar.module.css';
import { icuEditorStore } from '../../config/store';
import { icuTemplates } from '../../model/icuTemplates';
import type { ICUTemplate } from '../../model/icuTemplates';
import TemplateBox from './Templates/TemplateBox/TemplateBox';
import SearchTemplatesInput from './Templates/SearchTemplatesInput/SearchTemplatesInput';

type TabsItem = 'template';
const Navbar = () => {
  const t = useTranslations('common');
  const [searchResults, setSearchResults] = useState<Array<ICUTemplate>>([]);
  const changeSearchInputValue = icuEditorStore.use.actions().forceChangeSearchInputValue;
  const setSelectedTemplate = icuEditorStore.use.actions().setSelectedTemplate;
  const handleSearch = useDebouncedCallback(async (value: string) => {
    const result = value
      ? icuTemplates
          .filter(
            template => template.category.includes(value)
              || template.name.includes(value),
          )
      : [];
    setSearchResults(result);
  }, 300);

  return (
    <Box className={classes['navbarContainer']}>
      <Tabs defaultValue={'template' as TabsItem} classNames={{ tabLabel: classes['tabLabel'] }}>
        <Tabs.List>
          <Tabs.Tab value={'template' as TabsItem}>
            {t('template')}
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value={'template' as TabsItem}>
          <Stack mt="sm">
            <SearchTemplatesInput onChange={handleSearch} />
            <ScrollArea>
              <Stack mb="xs">
                {(searchResults.length ? searchResults : icuTemplates)
                  .map((result, i) => (
                    <TemplateBox
                      data={result}
                      key={`${result.name}-${i}`}

                      onClick={setSelectedTemplate}
                      onClickCategory={changeSearchInputValue}
                    />
                  ))}
              </Stack>
            </ScrollArea>
          </Stack>
        </Tabs.Panel>
      </Tabs>

    </Box>
  );
};

export default Navbar;
