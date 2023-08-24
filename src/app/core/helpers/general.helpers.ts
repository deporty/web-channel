import { IBaseResponse } from '@deporty-org/entities/general';
import { UserEntity } from '@deporty-org/entities/users';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { SHA256 } from 'crypto-js';
import { first, mergeMap } from 'rxjs/operators';
import { MetaData } from '../interfaces/general-action';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../presentation/components/modal/modal.component';
import {
  MAIN_DRAW_PHASES,
  TOURNAMENT_STATUS_CODES,
} from 'src/app/app.constants';

export function getStageIndicator(level: number) {
  return Number.isInteger(level)
    ? MAIN_DRAW_PHASES.find((d) => d.level === level)! 
    : {
        tag: 'Tercero/Cuarto',
        color: 'white',
        background: '#1a6cb2',
      };
}

export function getBreakpoint(width: number) {
  const map: any = {
    xs: (size: number) => {
      return size < 576;
    },
    sm: (size: number) => {
      return size >= 576 && size < 768;
    },

    md: (size: number) => {
      return size >= 768 && size < 992;
    },

    lg: (size: number) => {
      return size >= 992 && size < 1200;
    },

    xl: (size: number) => {
      return size >= 1200;
    },
  };
  for (const breakpoint in map) {
    if (Object.prototype.hasOwnProperty.call(map, breakpoint)) {
      const func = map[breakpoint];
      const response = func(width);
      if (response) {
        return breakpoint;
      }
    }
  }
  return 'md';
}

export function paginateItems<T>(
  pageSize: number,
  elements: Array<T>
): Array<Array<T>> {
  const response: Array<Array<T>> = [];
  let i = 0;
  let temp: Array<T> = [];
  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];
    temp.push(element);
    if (i == pageSize - 1) {
      response.push([...temp]);
      i = -1;
      temp = [];
    }
    i++;
  }
  if (temp.length > 0) {
    response.push([...temp]);
  }
  return response;
}

export function getFullName(user: UserEntity) {
  return `${user.firstName} ${user.secondName} ${user.firstLastName} ${user.secondLastName}`.replace(
    '  ',
    ' '
  );
}

export function isASuccessResponse<T>(response: IBaseResponse<T>) {
  return response.meta.code.includes('SUCCESS');
}

export function getTransactionIdentifier(obj: any) {
  const rep = JSON.stringify(obj);

  const hash = SHA256(rep).toString();
  return hash;
}

export function replaceTranslationTokens(text: string, tokens: any) {
  let response = text;
  if (text) {
    for (const key in tokens) {
      if (Object.prototype.hasOwnProperty.call(tokens, key)) {
        const value = tokens[key];

        response = response.replace(`{{${key}}}`, value);
      }
    }
  }
  return response;
}

export function getDisplay(status: string) {
  return TOURNAMENT_STATUS_CODES.filter((x) => x.value == status).pop()
    ?.display;
}
export function admingPopUpInComponent(config: {
  TransactionDeletedEvent: any;
  selectTransactionById: Function;
  store: Store;
  transactionId: string;
  translateService: TranslateService;
  dialog: MatDialog;
  onCloseDialogAction?: Function;
  onErrorAction?: Function;
  onSuccessAction?: Function;
  extraData?: any;
}) {
  const {
    store,
    translateService,
    selectTransactionById,
    transactionId,
    dialog,
    extraData,
    onCloseDialogAction,
    onSuccessAction,
    onErrorAction,
    TransactionDeletedEvent,
  } = config;

  let dialogLoading = dialog.open(ModalComponent, {
    width: '200px',
    height: '200px',
  });
  const DEFAULT_ERROR_MESSAGE =
    'Hubo un error en el servidor. Por favor comunícate con el administrador de Deporty.';
  const selectTransactionByIdSubscription = store
    .select(selectTransactionById(transactionId))

    .pipe(
      first((res: any) => {
        return !!res;
      }),
      mergeMap((t: MetaData) => {
        const text = translateService.get(`http-errors.${t.code}`);

        return text;
      })
    )
    .subscribe((t) => {
      let message = '';
      let title = '';
      let kind = '';
      if (typeof t === 'object') {
        message = t['message'];
        kind = t['kind'];
        title = t['title'];
      } else {
        console.log('*** ', t);

        if (t.includes('ERROR')) {
          kind = 'error';
          message = DEFAULT_ERROR_MESSAGE;
          title = 'Error inesperado en el servidor';
        } else {
          kind = 'success';
          message = 'Tu operación fue procesada en el servidor correctamente.';
          title = 'Operación exitosa';
        }
      }
      dialogLoading.close();
      let dialogRef = dialog.open(ModalComponent, {
        maxWidth: '300px',

        data: {
          kind: 'text',
          status: kind,
          title: replaceTranslationTokens(title, extraData),
          text: replaceTranslationTokens(message, extraData),
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (onCloseDialogAction) {
          onCloseDialogAction();
        }
        store.dispatch(
          TransactionDeletedEvent({
            transactionId,
          })
        );
        if (t['kind'] === 'success') {
          if (onSuccessAction) {
            onSuccessAction();
          }
        } else {
          if (onErrorAction) {
            onErrorAction(dialogLoading);
          }
        }
      });
    });
  return selectTransactionByIdSubscription;
}
