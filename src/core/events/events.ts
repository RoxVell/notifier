import { TsType, Type } from '../../types.js';
import { Filter } from '../interfaces';

function isChangeString(oldValue: string, newValue: string): boolean {
  return oldValue !== newValue;
}

function isChangeEqual(oldValue: string, newValue: string): boolean {
  return oldValue !== newValue;
}

interface EventBuilder<T extends string, P = never> {
  type: T;
  payload: P;
}

type StringChangeEvent = EventBuilder<StringEvent.Change>;
type StringEqualEvent = EventBuilder<StringEvent.Equal, string>;

type NumberChangeEvent = EventBuilder<NumberEvent.Change>;
type NumberLowerThanEvent = EventBuilder<NumberEvent.LowerThan, number>;
type NumberMoreThanEvent = EventBuilder<NumberEvent.MoreThan, number>;
type NumberEqualEvent = EventBuilder<NumberEvent.Equal, number>;

// type Filter = StringChangeEvent | StringEqualEvent |

enum NumberEvent {
  Change = 'Change',
  LowerThan = 'LowerThan',
  MoreThan = 'LowerThan',
  Equal = 'Equal',
  Increase = 'Increase',
  Decrease = 'Decrease',
}

enum StringEvent {
  Change = 'Change',
  Equal = 'Equal',
}

type EventDescription<T extends Type, P extends Type | never = never> = {
  payloadType?: P;
  fn: CheckFn<T, P>;
  message: MessageFn<T, P>;
}

type CheckFn<T extends Type, P extends Type | never> = (oldValue: TsType[T], newValue: TsType[T], payload: P extends never ? never : TsType[P]) => boolean;
type MessageFn<T extends Type, P extends Type | never> = (fieldName: string, oldValue: TsType[T], newValue: TsType[T], payload: P extends never ? never : TsType[P]) => string;

/**
 * Record<Type, Record<string, Filter<Type, Type>>>
 */
// export const EVENTS: Partial<Record<Type, Record<string, EventDescription>>> = {

type EventList = {
  [K in Type]: {
    [P: string]: EventDescription<K, any>;
  }
}

export const EVENTS: EventList = {
  [Type.Number]: {
    [NumberEvent.Change]: {
      fn: (oldValue: number, newValue: number) => oldValue !== newValue,
      message: (fieldName: string, oldValue: number, newValue: number) => {
        return `Значение показателя "${fieldName}" изменилось с "${oldValue}" на "${newValue}"`;
      }
    },
    [NumberEvent.LowerThan]: {
      payloadType: Type.Number,
      fn: (oldValue: number, newValue: number, lowerThanNumber: number) => newValue < lowerThanNumber,
      message: (fieldName: string, oldValue: number, newValue: number, payload: number) => {
        return `Значение показателя "${fieldName}" стало ниже, чем "${payload}"`;
      }
    },
    [NumberEvent.MoreThan]: {
      payloadType: Type.Number,
      fn: (oldValue: number, newValue: number, moreThanNumber: number) => newValue > moreThanNumber,
      message: (fieldName: string, oldValue: number, newValue: number, payload: number) => {
        return `Значение показателя "${fieldName}" превысило "${payload}"`;
      }
    },
    [NumberEvent.Equal]: {
      payloadType: Type.Number,
      fn: (oldValue: number, newValue: number, equalToNumber: number) => newValue === equalToNumber,
      message: (fieldName: string, oldValue: number, newValue: number) => {
        return `Значение показателя "${fieldName}" изменилось на "${newValue}"`;
      }
    },
    [NumberEvent.Increase]: {
      fn: (oldValue: number, newValue: number) => newValue > oldValue,
      message: (fieldName: string, oldValue: number, newValue: number) => {
        return `Значение показателя "${fieldName}" увеличилось с "${oldValue}" на "${newValue}"`;
      }
    },
    [NumberEvent.Decrease]: {
      fn: (oldValue: number, newValue: number) => newValue < oldValue,
      message: (fieldName: string, oldValue: number, newValue: number) => {
        return `Значение показателя "${fieldName}" понизилось с "${oldValue}" до "${newValue}"`;
      }
    },
  },
  [Type.String]: {
    [StringEvent.Change]: {
      fn: (oldValue: string, newValue: string) => oldValue !== newValue,
      message: (fieldName: string, oldValue: string, newValue: string) => {
        return `Значение показателя "${fieldName}" изменилось с "${oldValue}" до "${newValue}"`;
      }
    },
    [StringEvent.Equal]: {
      payloadType: Type.String,
      fn: (_: string, newValue: string, equalToString: string) => equalToString === newValue,
      message: (fieldName: string, oldValue: string, newValue: string) => {
        return `Значение показателя "${fieldName}" изменилось на "${newValue}"`;
      }
    }
  },
  [Type.Boolean]: {
    'Change': {
      fn: (oldValue: boolean, newValue: boolean) => oldValue !== newValue,
      message: (fieldName: string, oldValue: boolean, newValue: boolean) => {
        return `Значение показателя "${fieldName}" изменилось с "${oldValue}" на "${newValue}"`;
      }
    },
    'Equal': {
      payloadType: Type.Boolean,
      fn: (oldValue: boolean, newValue: boolean, payload: boolean) => newValue === payload,
      message: (fieldName: string, oldValue: boolean, newValue: boolean) => {
        return `Значение показателя "${fieldName}" изменилось с "${oldValue}" до "${newValue}"`;
      }
    },
  }
};

export function getEventsForType(type: Type): string[] {
  return Object.keys(EVENTS[type]);
}

export function isSatisfies<T extends Type>(type: T, oldValue: TsType[T], newValue: TsType[T], filters: Filter[]): boolean {
  // console.log('[isSatisfies]', {type, oldValue, newValue, filters});
  return filters.every(filter => {
    const some = EVENTS[type][filter.event];
    return some.fn(oldValue, newValue, filter.payload);
  });
}

export function getFilterPayloadType(type: Type, event: string): Type | null {
  console.log('getFilterPayloadType', {type, event})
  return getEvent(type, event).payloadType;
}

export function getEvent(type: Type, event: string): any { // TODO
  return EVENTS[type][event];
}

// console.log(isSatisfies(Type.Number, 5, 3, [
//   {
//     type: 'LowerThan',
//     payload: 2
//   },
//   {
//     type: 'Change'
//   }
// ]));