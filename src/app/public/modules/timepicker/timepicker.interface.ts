export interface SkyTimepickerTimeOutput {

  /**
   * Specifies the hour.
   */
  hour: number;

  /**
   * Specifies the minute.
   */
  minute: number;

  /**
   * Specifies the meridian.
   */
  meridie: string;

  /**
   * Specifies the timezone.
   */
  timezone: number;

  /**
   * Specifies the date in iso8601 format.
   */
  iso8601: Date;

  /**
   * Specifies the date in the current local time format.
   */
  local: string;

  /**
   * Specifies the time format string.
   */
  customFormat: string;
}
