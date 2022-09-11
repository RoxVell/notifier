import { Source } from './abstract-source.js';
import { Type } from '../../types.js';

interface TestItem {
  numberProperty: number;
  stringProperty: string;
  booleanProperty: boolean;
}

export class TestSource extends Source<TestItem> {
  title = 'Test Source';

  fields = {
    numberProperty: Type.Number,
    stringProperty: Type.String,
    booleanProperty: Type.Boolean,
  };

  private count = -1;

  async getItem(request: string): Promise<TestItem> {
    this.count++;

    const firstItem: TestItem = {
      numberProperty: 5,
      stringProperty: 'Lorem ipsum',
      booleanProperty: false
    };

    const secondItem: TestItem = {
      numberProperty: 10,
      stringProperty: 'Lorem ipsum some more',
      booleanProperty: true
    };

    const thirdItem: TestItem = {
      numberProperty: 7,
      stringProperty: 'Lorem ipsum some more',
      booleanProperty: true
    };

    return this.count === 0 ? firstItem : this.count === 1 ? secondItem : thirdItem;
  }

  async matches(request: string): Promise<boolean> {
    return request === 'test'
  }
}