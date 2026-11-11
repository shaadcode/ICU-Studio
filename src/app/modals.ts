import AddMissingMessageKeyModal from '@/features/I18nManager/modals/AddMissingMessageKey';
import AddMultipleTranslationsModal from '@/features/I18nManager/modals/AddMultipleTranslationsModal/AddMultipleTranslationsModal';

const modals = {
  createMessageKey: AddMissingMessageKeyModal,
  addMultipleTranslations: AddMultipleTranslationsModal,
} as const;

export default modals;
