export type MessageStats = {
  tags: number;
  words: number;
  characters: number;
  maxNesting: number;
  variables: Set<string>;
  pluralBranches: number;
  selectBranches: number;
  icuSyntaxChars: number;
  dateVariables: Set<string>;
  timeVariables: Set<string>;
  numberVariables: Set<string>;
};

export const createEmptyStats = (): MessageStats => ({
  tags: 0,
  words: 0,
  characters: 0,
  maxNesting: 0,
  pluralBranches: 0,
  selectBranches: 0,
  icuSyntaxChars: 0,
  variables: new Set(),
  dateVariables: new Set(),
  timeVariables: new Set(),
  numberVariables: new Set(),
});
