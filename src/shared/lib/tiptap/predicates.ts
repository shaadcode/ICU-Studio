import type { Transaction } from '@tiptap/pm/state';

// eslint-disable-next-line e18e/prefer-object-has-own
export const isUndoTransaction = (transaction?: Transaction): boolean => Object.prototype.hasOwnProperty.call(transaction?.['meta'], 'history$') && !transaction?.['meta']['history$']['redo'];

// eslint-disable-next-line e18e/prefer-object-has-own
export const isUndoRedoTransaction = (transaction: Transaction): boolean => Object.prototype.hasOwnProperty.call(transaction?.['meta'], 'history$');
