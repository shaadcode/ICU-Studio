import type { TreeNodeData } from '@mantine/core';

export const localeMessagesTree: TreeNodeData[] = [
  {
    label: 'common',
    value: 'common',
    nodeProps: { type: 'group' },
    children: [
      {
        label: 'save',
        value: 'common.save',
        nodeProps: { type: 'string', description: 'Save button label' },
      },
      {
        label: 'cancel',
        value: 'common.cancel',
        nodeProps: { type: 'string', description: 'Cancel button label' },
      },
      {
        label: 'delete',
        value: 'common.delete',
        nodeProps: { type: 'string', description: 'Delete action' },
      },
      {
        label: 'loading',
        value: 'common.loading',
        nodeProps: { type: 'string', description: 'Loading indicator text' },
      },
      {
        label: 'errors',
        value: 'common.errors',
        nodeProps: { type: 'group' },
        children: [
          {
            label: 'required',
            value: 'common.errors.required',
            nodeProps: { type: 'string', description: 'Field required error' },
          },
          {
            label: 'invalidEmail',
            value: 'common.errors.invalidEmail',
            nodeProps: { type: 'string', description: 'Invalid email error' },
          },
          {
            label: 'minLength',
            value: 'common.errors.minLength',
            nodeProps: {
              type: 'icu',
              description: 'Min length error with variable',
            },
          },
        ],
      },
    ],
  },
  {
    label: 'Home',
    value: 'Home',
    nodeProps: { type: 'group' },
    children: [
      {
        label: 'header',
        value: 'Home.header',
        nodeProps: { type: 'group' },
        children: [
          {
            label: 'title',
            value: 'Home.header.title',
            nodeProps: { type: 'string', description: 'Home page main title' },
          },
          {
            label: 'subtitle',
            value: 'Home.header.subtitle',
            nodeProps: { type: 'string', description: 'Home page subtitle' },
          },
        ],
      },
      {
        label: 'cta',
        value: 'Home.cta',
        nodeProps: { type: 'group' },
        children: [
          {
            label: 'getStarted',
            value: 'Home.cta.getStarted',
            nodeProps: { type: 'string', description: 'CTA primary button' },
          },
          {
            label: 'learnMore',
            value: 'Home.cta.learnMore',
            nodeProps: { type: 'string', description: 'CTA secondary link' },
          },
        ],
      },
    ],
  },
  {
    label: 'Auth',
    value: 'Auth',
    nodeProps: { type: 'group' },
    children: [
      {
        label: 'login',
        value: 'Auth.login',
        nodeProps: { type: 'group' },
        children: [
          {
            label: 'title',
            value: 'Auth.login.title',
            nodeProps: { type: 'string', description: 'Login form title' },
          },
          {
            label: 'welcome',
            value: 'Auth.login.welcome',
            nodeProps: {
              type: 'icu',
              description: 'Welcome message with username variable',
            },
          },
          {
            label: 'attemptsLeft',
            value: 'Auth.login.attemptsLeft',
            nodeProps: {
              type: 'icu',
              description: 'Plural message for remaining attempts',
            },
          },
        ],
      },
      {
        label: 'register',
        value: 'Auth.register',
        nodeProps: { type: 'group' },
        children: [
          {
            label: 'title',
            value: 'Auth.register.title',
            nodeProps: { type: 'string', description: 'Register form title' },
          },
          {
            label: 'success',
            value: 'Auth.register.success',
            nodeProps: { type: 'icu', description: 'Registration success with name' },
          },
        ],
      },
    ],
  },
  {
    label: 'Cart',
    value: 'Cart',
    nodeProps: { type: 'group' },
    children: [
      {
        label: 'items',
        value: 'Cart.items',
        nodeProps: {
          type: 'icu',
          description: 'Plural items count in cart',
        },
      },
      {
        label: 'empty',
        value: 'Cart.empty',
        nodeProps: { type: 'string', description: 'Empty cart message' },
      },
      {
        label: 'checkout',
        value: 'Cart.checkout',
        nodeProps: { type: 'group' },
        children: [
          {
            label: 'button',
            value: 'Cart.checkout.button',
            nodeProps: { type: 'string', description: 'Checkout button text' },
          },
          {
            label: 'total',
            value: 'Cart.checkout.total',
            nodeProps: {
              type: 'icu',
              description: 'Total price with currency formatting',
            },
          },
        ],
      },
    ],
  },
  {
    label: 'Notifications',
    value: 'Notifications',
    nodeProps: { type: 'group' },
    children: [
      {
        label: 'newMessage',
        value: 'Notifications.newMessage',
        nodeProps: {
          type: 'icu',
          description: 'New message notification with sender',
        },
      },
      {
        label: 'orderShipped',
        value: 'Notifications.orderShipped',
        nodeProps: {
          type: 'icu',
          description: 'Order shipped with tracking number',
        },
      },
    ],
  },
];
