export type MessageStats = {
  tags: number;
  words: number;
  numbers: number;
  textRatio: number;
  characters: number;
  maxNesting: number;
  punctuation: number;
  literalWords: number;
  variables: Set<string>;
  pluralBranches: number;
  selectBranches: number;
  icuSyntaxChars: number;
  icuSyntaxRatio: number;
  literalCharacters: number;
  dateVariables: Set<string>;
  timeVariables: Set<string>;
  numberVariables: Set<string>;
};

export function createEmptyStats(): MessageStats {
  return {
    tags: 0,
    words: 0,
    numbers: 0,
    textRatio: 0,
    characters: 0,
    maxNesting: 0,
    punctuation: 0,
    literalWords: 0,
    pluralBranches: 0,
    selectBranches: 0,
    icuSyntaxChars: 0,
    icuSyntaxRatio: 0,
    variables: new Set(),
    literalCharacters: 0,
    dateVariables: new Set(),
    timeVariables: new Set(),
    numberVariables: new Set(),
  };
};
