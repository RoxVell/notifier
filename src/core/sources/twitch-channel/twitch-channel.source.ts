import { Source } from '../abstract-source.js';
import { ApiClient } from '@twurple/api';

interface TwitchUser {

}

export class TwitchChannelSource extends Source<TwitchUser> {
  title = 'Twitch Канал';
  fields = {};

  getItem(request: string): Promise<unknown> {
    return Promise.resolve(undefined);
  }

  async matches(request: string): Promise<boolean> {
    return /https:\/\/www.twitch.tv\/.+/.test(request) || /https:\/\/twitch.tv\/.+/.test(request);
  }
}