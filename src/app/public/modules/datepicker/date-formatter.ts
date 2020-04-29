const moment = require('moment');

export class SkyDateFormatter {

  public static getDateFormat(locale: string): string {
    moment.locale(locale || 'en-US');
    return moment.localeData().longDateFormat('L');
  }

  public format(date: Date, format: string): string {
    return moment(date.getTime()).format(format);
  }

  public getDateFromString(dateString: string, format: string, strict: boolean = false): Date {
    let momentValue = moment(dateString, format, strict);

    if (!momentValue.isValid()) {
      momentValue = moment(dateString, 'YYYY-MM-DDThh:mm:ss.sssZ', strict);
    }

    return momentValue.toDate();
  }

  public dateIsValid(date: Date): boolean {
    return (
      date &&
      date instanceof Date &&
      !isNaN(date.valueOf()) &&
      !isNaN(new Date(date).getDate())
    );
  }
}
