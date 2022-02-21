import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

import { DATE_FORMATS } from 'src/app/web/home/shared/enums/date-formats.enum';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    let output = '';

    switch (args[0]) {
      case 'DMY':
        output = moment(value).format(DATE_FORMATS.DDMMYYYY);
        break;
    }

    return output;
  }
}
