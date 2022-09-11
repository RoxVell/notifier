import TelegramBot, { InlineKeyboardButton } from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';
import { Source } from './core/sources/abstract-source.js';
import { getEvent, getEventsForType, getFilterPayloadType } from './core/events/events.js';
import { v4 as uuidv4 } from 'uuid';
import { TelegramNotifier } from './core/notifications/telegram.notifier.js';
import { DIContainer } from './di/inversify.config.js';
import { TYPES } from './di/types.js';
import { INotifierFacade } from './core/notifier-facade/notifier.facade.interface';
import { IUpdater } from './core/updater/updater.interface';
import { tryToConvertValueToType, Type } from './types.js';

interface DotEnvConfig {
  TELEGRAM_TOKEN: string;
}
const { TELEGRAM_TOKEN } = dotenv.config().parsed as unknown as DotEnvConfig;

// const LHS = { title: 'Ноутбук Apple MacBook Air M2 2022', price: 85890 };
//
// const RHS = { title: 'Ноутбук Apple MacBook Air M2 2022', price: 84890 };
//
// console.log(pkg.diff(LHS, RHS));

const notifierFacade = DIContainer.get<INotifierFacade>(TYPES.NotifierFacade);
const updater = DIContainer.get<IUpdater>(TYPES.Updater);

updater.startUpdating();

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.on("polling_error", console.log);

enum CallbackType {
  SelectField = 'SF',
  SelectEvent = 'SE',
}

// type CallbackDataGeneric<P extends Array<unknown>> = [id: string, type: T, ...payload: P];

type CallbackDataBuilder<T extends CallbackType, P extends Array<unknown>> = [id: string, type: T, ...payload: P];

type SelectFieldPayload = [field: string];
type CallbackDataSelectField = CallbackDataBuilder<CallbackType.SelectField, SelectFieldPayload>;

type SelectEventPayload = [event: string];
type CallbackDataSelectEvent = CallbackDataBuilder<CallbackType.SelectEvent, SelectEventPayload>;

type CallbackData = CallbackDataSelectField | CallbackDataSelectEvent;

console.log(`Бот готов принимать заказы`);

const userContexts = new Map<number, {
  id: string,
  request: string,
  source: Source,
  field?: string;
  event?: string;
}>();

function handleSelectFieldStep(query: TelegramBot.CallbackQuery, payload: CallbackDataSelectField) {
  console.log('handleSelectFieldStep', { payload })
  const [id, type, field] = payload;
  const context = userContexts.get(query.from.id);

  if (!context) {
    console.error(`Контекст в функции "handleSelectFieldStep" с id: "${query.from.id}" не найден`);
    return;
  }

  userContexts.set(query.from.id, {...context, field});

  const source = context!.source;
  // const source = notifierFacade.getSourceById(sourceId)!;
  // @ts-ignore
  const fieldType = source.getFieldType(field);
  const events = getEventsForType(fieldType);

  const keyboardButtons: InlineKeyboardButton[] = events.map((event: any) => {
    const callbackData: CallbackDataSelectEvent = [
      id,
      CallbackType.SelectEvent,
      event,
    ];

    return {
      text: event,
      callback_data: JSON.stringify(callbackData)
    };
  });

  bot.sendMessage(query.from.id, `Выберите событие`, {
    reply_markup: {
      inline_keyboard: [keyboardButtons]
    }
  });
}

function handleSelectEventStep(query: TelegramBot.CallbackQuery, payload: CallbackDataSelectEvent) {
  const [id, sourceId, event] = payload;
  const context = userContexts.get(query.from.id);

  if (!context) {
    console.error(`Контекст в функции "handleSelectEventStep" с id: "${query.from.id}" не найден`);
    return;
  }

  userContexts.set(query.from.id, {
    ...context,
    event
  });

  const source = context!.source;
  const field = context!.field!;

  // @ts-ignore
  const ev = getEvent(source.getFieldType(field), event);

  const filterPayloadType = ev.payloadType as Type;

  if (filterPayloadType) {
    bot.sendMessage(query.from.id, `Введите payload`, {
      reply_markup: {
        force_reply: true,
      },
    }).then(message => {
      const replyListenerId = bot.onReplyToMessage(query.from.id, message.message_id, msg => {
        bot.removeReplyListener(replyListenerId);
        const payloadText = msg.text;

        const payload = tryToConvertValueToType(payloadText, filterPayloadType);

        console.log(`Payload`, payload);
        notifierFacade.subscribe(
          context.request,
          context.source,
          [
            {
              field: context.field!,
              event: event,
              payload: payload,
            }
          ],
          [
            new TelegramNotifier({
              token: TELEGRAM_TOKEN,
              chatId: String(query.from.id)
            })
          ]
        );
        bot.sendMessage(query.from.id, `Вы успешно подписались на параметр ${field}, событие: ${event}, payload: ${payload}, ссылка: ${context.request}`);
      });
    });
  } else {
    notifierFacade.subscribe(
      context.request,
      context.source,
      [
        {
          field,
          event,
        }
      ],
      [
        new TelegramNotifier({
          token: TELEGRAM_TOKEN,
          chatId: String(query.from.id)
        })
      ]
    );
    bot.sendMessage(query.from.id, `Вы успешно подписались на параметр ${field}, событие: ${event}`);
  }
}

bot.on('callback_query', query => {
  console.log(query);
  const parsedData = JSON.parse(query.data!) as CallbackData;

  switch (parsedData[1]) {
    case CallbackType.SelectField: {
      handleSelectFieldStep(query, parsedData);
      break;
    }
    case CallbackType.SelectEvent:
      handleSelectEventStep(query, parsedData);
      break;
  }
});

// @ts-ignore
bot.onText(/\/add (.+)/, async (msg, match) => {
  console.log(`Получено сообщение от пользователя "${msg.from?.username}", message id: ${msg.message_id}, chatId: "${msg.chat.id}"`);
  const chatId = msg.chat.id;
  // @ts-ignore
  const request = match[1];

  const source = await notifierFacade.getSourceByRequest(request);

  if (!source) {
    console.log(`Source for request "${request}" not found`);
    return;
  }

  if (source) {
    const id = uuidv4().slice(0, 10);

    const keyboardButtons: InlineKeyboardButton[] = Object.keys(source[1].fields).map(key => {
      // const callbackData: CallbackDataSelectField = [
      //   CallbackType.SelectField,
      //   request,
      //   source[0],
      //   key,
      // ];

      const callbackData: CallbackDataSelectField = [id, CallbackType.SelectField, key];

      return {
        text: key,
        callback_data: JSON.stringify(callbackData)
      };
    });

    userContexts.set(msg.from!.id!, { id: id, request, source: source[1] });

    await bot.sendMessage(chatId, 'На изменение какого параметра подписаться?', {
      reply_markup: {
        inline_keyboard: [
          keyboardButtons,
        ],
      }
    });
  } else {
    bot.sendMessage(chatId, 'Нет источников, удовлетворяющих такому критерию');
  }
});
