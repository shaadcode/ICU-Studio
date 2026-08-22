export type ICUTemplate = {
  id: number;
  name: string;
  content: string;
  category: Categories;
};
type Categories
  = 'time'
    | 'basic'
    | 'lists' | 'dates' | 'select' | 'nested' | 'ordinal' | 'numbers' | 'richtext' | 'advanced' | 'pluralization';

export const icuTemplates = [
  {
    id: 1,
    category: 'basic',
    name: 'simple variable',
    content: 'Hello, {name}!',
  },
  {
    id: 2,
    category: 'basic',
    name: 'multiple variables',
    content: 'hi, {firstName} {lastName}!',
  },
  {
    id: 3,
    name: 'simple plural',
    category: 'pluralization',
    content: '{count, plural, =0 {No items} one {1 item} other {# items}}',
  },
  {
    id:
    3,
    category: 'pluralization',
    name: 'plural with offset',
    content: '{age, plural, offset:1  =0 {This is a newborn baby!}  =1 {You are 1 year old today!}  one {You are # year old today!}  other {You are # years old today!}}',
  },
  {
    id: 4,
    category: 'pluralization',
    name: 'plural with number skeleton',
    content: '{visitors, plural, offset:1  =0 {No visitors yet}  =1 {It\'s just you!}  one {You and {visitors, number, ::percent}% of our visitors}  other {You and {visitors, number, ::percent}% of our visitors}}',
  },
  {
    id: 5,
    category: 'select',
    name: 'simple select',
    content: '{gender, select,  male {John is online}  female {Sarah is online}  other {Alex is online}}',
  },
] as const satisfies Array<ICUTemplate>;
