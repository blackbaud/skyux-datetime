/**
 * The configuration for a custom date.
 */
export interface SkyDatepickerCustomDate {

  /**
   * The date to customize.
   */
  date: Date;

  /**
   * Indicates whether to disable the date.
   */
  disabled?: boolean;

  /**
   * Indicates whether to display the date as important in the calendar.
   */
  important?: boolean;

  /**
   * Displays a popup of the provided text when hovering over the important date in the calendar.
   */
  importantText?: Array<string>;

}
