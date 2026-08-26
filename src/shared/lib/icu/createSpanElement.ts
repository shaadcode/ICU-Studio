export type CreateSpanElemParams = {
  value: string;
  withBr?: boolean;
  className?: string;
  referenceId?: `depth-${number}`;
};

export const createSpanElement = (params: CreateSpanElemParams) => {
  const elem = document.createElement('span');
  elem.textContent = params.value;

  if (params.referenceId) {
    elem.dataset['referenceId'] = params.referenceId;
  }

  if (params.className) {
    const classes = params.className?.split(' ') ?? [];
    elem.classList.add(...classes);
  }

  if (params.withBr) {
    elem.innerHTML += '\n';
  }

  return elem;
};
