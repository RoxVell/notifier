import { Source } from '../abstract-source.js';
import { Type } from '../../../types.js';

export class YoutubeVideoSource extends Source {
  title = 'Youtube Video';
  fields = {
    views: Type.Number,
    title: Type.String,
    likes: Type.Number,
    dislikes: Type.Number,
  };

  async matches(request: string): Promise<boolean> {
    return /https:\/\/www\.youtube\.com\/watch\?v=.+/.test(request);
  }

  getItem(request: string): Promise<unknown> {
    return Promise.resolve(undefined);
  }
}
