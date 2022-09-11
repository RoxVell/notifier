import "reflect-metadata";
import { Container } from 'inversify';
import { TYPES } from './types.js';

import { IFiltersRepository } from '../core/filters-repository/filters-repository.interface';
import { FiltersRepository } from '../core/filters-repository/filters-repository.js';

import { IItemsRepository } from '../core/items-repository/items-repository.interface';
import { ItemsRepository } from '../core/items-repository/items-repository.js';

import { IRequestRepository } from '../core/request-repository/request-repository.interface';
import { UrlRequestRepository } from '../core/request-repository/url-request-repository.js';

import { ISourcesRepository } from '../core/sources-repository/sources-repository.interface';
import { SourcesList, SourcesRepository } from '../core/sources-repository/sources-repository.js';

import { ISubscribersRepository } from '../core/subscribers-repository/subscribers-repository.interface';
import { SubscribersRepository } from '../core/subscribers-repository/subscribers-repository.js';

import { IUpdater } from '../core/updater/updater.interface';
import { Updater } from '../core/updater/updater.js';

import { INotifierRepository } from '../core/notifications/notifier-repository.interface';
import { NotifiersRepository } from '../core/notifications/notifiers-repository.js';

import { INotifierFacade } from '../core/notifier-facade/notifier.facade.interface';
import { NotifierFacade } from '../core/notifier-facade/notifier.facade.js';

import { AvitoAdSource } from '../core/sources/avito-ad/avito-ad.source.js';
import { YoutubeVideoSource } from '../core/sources/youtube-video/youtube-video.source.js';

import { TestSource } from '../core/sources/test.source.js';

const DIContainer = new Container();

DIContainer.bind<IFiltersRepository>(TYPES.FiltersRepository).to(FiltersRepository).inSingletonScope();
DIContainer.bind<IItemsRepository>(TYPES.ItemsRepository).to(ItemsRepository).inSingletonScope();
DIContainer.bind<IRequestRepository>(TYPES.RequestRepository).to(UrlRequestRepository).inSingletonScope();
DIContainer.bind<ISourcesRepository>(TYPES.SourcesRepository).to(SourcesRepository).inSingletonScope();
DIContainer.bind<SourcesList>(TYPES.SourcesList).toConstantValue([
  ['1', new AvitoAdSource()],
  ['2', new YoutubeVideoSource()],
  ['3', new TestSource()],
]);
DIContainer.bind<ISubscribersRepository>(TYPES.SubscribersRepository).to(SubscribersRepository).inSingletonScope();;
DIContainer.bind<INotifierRepository>(TYPES.NotifiersRepository).to(NotifiersRepository).inSingletonScope();;
DIContainer.bind<IUpdater>(TYPES.Updater).to(Updater);
DIContainer.bind<INotifierFacade>(TYPES.NotifierFacade).to(NotifierFacade);

export { DIContainer };
