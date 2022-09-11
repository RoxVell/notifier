export enum Type {
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
}

export interface TsType {
  [Type.String]: string;
  [Type.Number]: number;
  [Type.Boolean]: boolean;
}

export function isValueMatchesType(value: unknown, type: Type): boolean {
  switch (type) {
    case Type.Number:
      return !Number.isNaN(value);
    case Type.Boolean:
      return value === 'true' || value === 'false';
    case Type.String:
      return typeof value === 'string';
  }
}

export function tryToConvertValueToType<T extends Type>(value: unknown, type: T): TsType[T] {
  if (isValueMatchesType(value, type)) {
    switch (type) {
      case Type.Number:
        // @ts-ignore
        return Number(value);
      case Type.Boolean:
        // @ts-ignore
        return Boolean(value);
      case Type.String:
        // @ts-ignore
        return String(value);
    }
  } else {
    throw new Error(``);
  }

  throw new Error(`Unsupported type "${type}"`);
}

