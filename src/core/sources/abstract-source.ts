import { Type } from '../../types.js';

export abstract class Source<T = unknown> {
  public abstract title: string;
  public abstract fields: Partial<Record<keyof T, Type>>;

  abstract matches(request: string): Promise<boolean>;
  abstract getItem(request: string): Promise<unknown>;

  getFieldType(field: keyof T): Type {
    return this.fields[field]!;
  }
}

