import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({ name: 'packageValidityShow' })
export class packagevalidityShowPipe implements PipeTransform {
  transform(value: number, date?: string): any {

    return moment(date, 'DD-MM-YYYY')
      .add(value, 'days')
      .format('MMM DD, YYYY');
  }
}
