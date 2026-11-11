import { set } from 'es-toolkit/compat';
import { useTranslations } from 'use-intl';
import { useState, useEffect } from 'react';
import type { ComboboxItem } from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import type { UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import type { ContextModalProps } from '@mantine/modals';
import { isNull, uniqBy, attemptAsync } from 'es-toolkit';
import { IconEdit, IconCheck } from '@tabler/icons-react';
import { revealItemInDir } from '@tauri-apps/plugin-opener';
import { Text, Group, Stack, Badge, Button, Select, Divider, TextInput, ActionIcon } from '@mantine/core';

import KeyPathInput from './KeyPathInput';
import { readJsonFileSafe } from '../../lib';
import ICUEditor from '@/pages/landing/ui/Editor/Editor';
import { icuEditorStore } from '@/pages/landing/config/store/editor';
import type { Locale, Namespace } from '@/pages/landing/config/store/i18nManager/types';

export type AddMultipleTranslationsParams = {
  locales: Locale[];
  baseLocale?: Locale;
  initialKey?: string;
  namespaces: Namespace[];
  initialNamespace?: Namespace;
};

type Props = AddMultipleTranslationsParams & {
  onSubmit?: () => void;
};

type FormValues = {
  keyPath: string;
  namespace: null | Namespace;
  translations: Record<string, string>;
};

const AddMultipleTranslationsModal = ({
  id,
  context,
  innerProps,
}: ContextModalProps<Props>) => {
  const tCommon = useTranslations('common');
  const t = useTranslations('i18nManager');
  const { locales, namespaces, initialKey, initialNamespace } = innerProps;
  const uniqueNamespaces = uniqBy(namespaces, ns => ns.fileName);
  const [isLoading, setIsLoading] = useState(false);
  const [activeLocale, setActiveLocale] = useState<null | Locale>(null);
  const [isSearching, setIsSearching] = useState(false);
  const clearStore = icuEditorStore.use.actions().clearStore;
  const editorInstance = icuEditorStore.use.editorInstance();

  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    validateInputOnBlur: true,
    initialValues: {
      translations: {},
      keyPath: initialKey || '',
      namespace: initialNamespace || null,
    },
    validate: {
      keyPath: isNotEmpty(),
      namespace: isNotEmpty(),
      translations: value => Object.keys(value).length === 0,
    },
  });

  useEffect(() => {
    return () => {
      clearStore();
    };
  }, [clearStore]);

  const handleOpenEditor = (locale: Locale) => setActiveLocale(locale);

  const handleSaveEditor = () => {
    if (!activeLocale || !editorInstance) {
      return;
    }

    const textContent = editorInstance.getText();
    form.setFieldValue(`translations.${activeLocale.language.code}`, textContent);

    setActiveLocale(null);
    clearStore();
  };

  const handleCancelEditor = () => {
    setActiveLocale(null);
    clearStore();
  };

  const handleSubmit = async (values: FormValues) => {
    const { keyPath } = values;
    if (!keyPath.trim()) {
      return;
    }

    setIsLoading(true);

    const [error] = await attemptAsync(async () => {
      locales.forEach(async (locale) => {
        const value = values.translations[locale.language.code];
        const namespaceByLocale = namespaces.find(ns => ns.locale.language.code === locale.language.code);
        if (isNull(value?.trim()) || !namespaceByLocale) {
          return;
        }
        const content = await readJsonFileSafe(namespaceByLocale.path);
        set(content, values.keyPath, value);
        await writeTextFile(namespaceByLocale.path, JSON.stringify(content, null, 2));
      });
    });

    setIsLoading(false);

    if (error) {
      return notifications.show({
        title: tCommon('errors.unexpectedError.title'),
        message: tCommon('errors.unexpectedError.message'),
      });
    }

    innerProps.onSubmit?.();
    return context.closeModal(id);
  };

  const handleSearchKey = async () => {
    const currentNamespace = form.values.namespace;
    const currentKeyPath = form.values.keyPath.trim();

    if (!currentNamespace || !currentKeyPath) {
      return;
    }

    setIsSearching(true);
    const foundTranslations: Record<string, string> = {};

    await attemptAsync(async () => {
      // ۱. پیدا کردن نام namespace بدون پسوند
      const nsName = currentNamespace.name; // مثلاً "common"

      // ۲. برای هر زبان، فایل مربوط به آن زبان و namespace را پیدا می‌کنیم
      for (const locale of locales) {
        const localeCode = locale.language.code;

        // پیدا کردن مسیر فایل مخصوص این زبان و namespace
        const targetNs = namespaces.find(
          ns => ns.name === nsName && ns.locale.language.code === localeCode,
        );

        if (!targetNs) {
          continue;
        }

        const content = await readJsonFileSafe(targetNs.path);

        // استخراج مقدار با استفاده از dot notation
        const value = currentKeyPath
          .split('.')
          .reduce((acc: any, part) => acc?.[part], content);

        if (value !== undefined && value !== null) {
          foundTranslations[localeCode] = String(value);
        }
      }

      // ۳. آپدیت فرم با مقادیر پیدا شده
      if (Object.keys(foundTranslations).length > 0) {
        form.setValues({
          translations: foundTranslations,
        });
      } else {
        form.setValues({ translations: {} });
      }
    });

    setIsSearching(false);
  };

  return (
    <Stack
      component="form"

      // @ts-expect-error
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <Select
        searchable
        withAsterisk
        allowDeselect={false}
        label={t('localesTab.missingKeysTable.table.namespace')}
        disabled={!!initialNamespace || !!activeLocale || isLoading}
        placeholder={t('localesTab.modals.addMultiple.selectNamespace')}
        data={uniqueNamespaces.map(ns => ({
          namespace: ns,
          value: ns.name,
          label: ns.name,
        }))}

        onChange={(_, option) => {
          const ns = (option as ComboboxItem<string> & { namespace: Namespace })?.namespace;
          form.setFieldValue('namespace', ns || null);
        }}
      />

      {form.values.namespace && (
        <Text
          size="sm"
          c="dimmed"
          ff="monospace"
          style={{ cursor: 'pointer' }}

          onClick={async () =>
            attemptAsync(async () => revealItemInDir(form.values.namespace!.path))}
        >
          {form.values.namespace.path}
        </Text>
      )}

      <KeyPathInput
        isLoading={isLoading}
        isSearching={isSearching}
        activeLocale={activeLocale}
        initialValue={form.values.keyPath}

        onSearch={handleSearchKey}
        onChange={value => form.setFieldValue('keyPath', value)}
        onDebounceChange={value => form.setFieldValue('keyPath', value)}
      />

      <Divider />

      {activeLocale
        ? (
            <ICUEditorState
              activeLocale={activeLocale}
              handleSaveEditor={handleSaveEditor}
              handleCancelEditor={handleCancelEditor}
              initialTranslation={form.values.translations[activeLocale.language.code]}
            />
          )
        : (
            <SimpleInputsState
              form={form}
              locales={locales}
              isLoading={isLoading}
              baseLocale={innerProps.baseLocale}
              handleOpenEditor={handleOpenEditor}
            />
          )}

      {!activeLocale && (
        <Group mt="md" justify="flex-end">
          <Button
            variant="default"
            disabled={isLoading}

            onClick={() => context.closeModal(id)}
          >
            {tCommon('cancel')}
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={!form.isValid()}
          >
            {tCommon('save')}
          </Button>
        </Group>
      )}
    </Stack>
  );
};

function ICUEditorState(params: {
  activeLocale: Locale;
  handleSaveEditor: () => void;
  handleCancelEditor: () => void;
  initialTranslation: string | undefined;
}) {
  const tCommon = useTranslations('common');
  const t = useTranslations('i18nManager');
  const isEmpty = icuEditorStore.use.isEmpty();
  const editorInstance = icuEditorStore.use.editorInstance();

  useEffect(() => {
    if (editorInstance && params.initialTranslation) {
      editorInstance.chain().setContent(params.initialTranslation).run();
    }
  }, [params.initialTranslation, editorInstance]);

  return (
    <Stack>
      <Group justify="space-between">
        <Group gap="xs">
          <Text fw={500} size="sm">
            {t('localesTab.modals.addMultiple.editingFor')}
            {':\r'}
          </Text>
          <Badge color="blue" variant="light">
            {params.activeLocale.language.code.toUpperCase()}
          </Badge>
        </Group>
        <Button
          size="xs"
          variant="subtle"

          onClick={params.handleCancelEditor}
        >
          {tCommon('back')}
        </Button>
      </Group>

      <ICUEditor />

      <Group mt="sm" justify="flex-end">
        <Button
          disabled={isEmpty}
          leftSection={<IconCheck size={16} />}

          onClick={params.handleSaveEditor}
        >
          {t('localesTab.modals.addMultiple.applyValue')}
        </Button>
      </Group>
    </Stack>
  );
}

function SimpleInputsState(params: {
  isLoading: boolean;
  baseLocale?: Locale;
  locales: Array<Locale>;
  form: UseFormReturnType<FormValues>;
  handleOpenEditor: (l: Locale) => void;
}) {
  const t = useTranslations('i18nManager');

  return (
    <Stack gap="sm">
      <Text fw={500} size="sm">
        {t('localesTab.modals.addMultiple.translationsLabel')}
      </Text>

      {params.locales.map((locale) => {
        const fieldPath = `translations.${locale.language.code}` as const;
        return (
          <Group wrap="nowrap" align="flex-end" key={locale.language.code}>
            <TextInput
              flex={1}
              ff="monospace"
              disabled={params.isLoading}
              {...params.form.getInputProps(fieldPath)}
              placeholder={t('localesTab.modals.addMultiple.clickToEdit')}
              rightSection={(
                <ActionIcon
                  size="sm"
                  radius={6}

                  onClick={() => params.handleOpenEditor(locale)}
                >
                  <IconEdit size="70%" />
                </ActionIcon>
              )}
              label={(
                <Group gap="xs">
                  <Text fw={500} size="sm">{locale.language.code.toUpperCase()}</Text>
                  <Text size="xs" c="dimmed">{locale.language.name}</Text>
                  {params.baseLocale?.language.code === locale.language.code && <Badge size="xs" color="blue">{'BASE'}</Badge>}
                </Group>
              )}
            />
          </Group>
        );
      })}

    </Stack>
  );
}

export default AddMultipleTranslationsModal;
