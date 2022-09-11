import fetch from 'node-fetch';
import { Source } from '../abstract-source.js';
import { Type } from '../../../types.js';
import { parse } from 'node-html-parser';

interface AvitoAd {
  // id: number;
  title: string;
  // categoryId: number;
  price: number;
  // image: string;
}

export class AvitoAdSource extends Source<AvitoAd> {
  public title = 'Объявление авито';
  public fields = {
    'price': Type.Number,
    'title': Type.String,
    // 'image': Type.String
  };

  async matches(request: string): Promise<boolean> {
    return fetch(request)
      .then(response => response.text())
      .then(response => {
        const parser = parse(response);
        const priceElement = parser.querySelector('meta[property="product:price:amount"]');
        return priceElement !== null;
      })
      .catch(() => false);
  }

  async getItem(request: string): Promise<AvitoAd> {
    return fetch(request)
      .then(response => response.text())
      .then(htmlText => {
        const parser = parse(htmlText);

        const priceElement = parser.querySelector('meta[property="product:price:amount"]');
        const titleElement = parser.querySelector('meta[property="og:image:alt"]');

        // const id = /avito\.item\.id = '(\d+)';/.exec(htmlText)![1];
        // const categoryId = /avito\.item\.categoryId = (\d+);/.exec(htmlText)![1];
        // const image = /avito\.item\.image = '(.*)';/.exec(htmlText)![1];

        return {
          // id: Number(id),
          title: titleElement?.attributes['content'] as string,
          // categoryId: Number(categoryId),
          price: Number(priceElement?.attributes['content']),
          // image,
        };
      });
  }
}
