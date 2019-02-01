// import {
//   SkyDateRange
// } from './date-range';

// import {
//   SkyDateRangeType
// } from './date-range-type';
// import { SkyLibResourcesService } from '@skyux/i18n';

// export class SkyDateRangeService {
//   // #region relative date range values
//   public get lastFiscalYear(): SkyDateRange {
//     const start = new Date();
//     start.setDate(1);
//     start.setFullYear(start.getFullYear() - 1);

//     const { startDate, endDate } = this.getClosestFiscalYearRange(start);

//     return {
//       dateRangeType: SkyDateRangeType.LastFiscalYear,
//       startDate,
//       endDate
//     };
//   }

//   public get lastMonth(): SkyDateRange {
//     const firstDayOfMonth = new Date();
//     // First, set the day of the month to zero,
//     // which points to the last day of the previous month.
//     firstDayOfMonth.setDate(0);
//     // Finally, set the day of the month to 1.
//     firstDayOfMonth.setDate(1);

//     const lastDayOfMonth = new Date();
//     lastDayOfMonth.setDate(0);

//     return {
//       dateRangeType: SkyDateRangeType.LastMonth,
//       startDate: firstDayOfMonth,
//       endDate: lastDayOfMonth
//     };
//   }

//   public get lastQuarter(): SkyDateRange {
//     const startDate = new Date();
//     startDate.setDate(1);

//     const endDate = new Date();
//     endDate.setDate(1);

//     const beginningOfQuarter = Math.floor((startDate.getMonth() - 1) / 3) * 3;
//     if (beginningOfQuarter === 0) {
//       startDate.setFullYear(startDate.getFullYear() - 1);
//       startDate.setMonth(9);
//       endDate.setMonth(0);
//       endDate.setDate(0);
//     } else {
//       startDate.setMonth(beginningOfQuarter - 3);
//       endDate.setMonth(beginningOfQuarter);
//       endDate.setDate(0);
//     }

//     return {
//       dateRangeType: SkyDateRangeType.LastQuarter,
//       startDate,
//       endDate
//     };
//   }

//   public get lastWeek(): SkyDateRange {
//     const firstDayOfWeek = new Date();
//     firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay() - 7);

//     const lastDayOfWeek = new Date();
//     lastDayOfWeek.setDate(lastDayOfWeek.getDate() - lastDayOfWeek.getDay() - 1);

//     return {
//       dateRangeType: SkyDateRangeType.LastWeek,
//       startDate: firstDayOfWeek,
//       endDate: lastDayOfWeek
//     };
//   }

//   public get lastYear(): SkyDateRange {
//     const startDate = new Date();
//     startDate.setDate(1);
//     startDate.setMonth(0);
//     startDate.setFullYear(startDate.getFullYear() - 1);

//     const endDate = new Date();
//     endDate.setDate(1);
//     endDate.setMonth(0);
//     endDate.setDate(0);

//     return {
//       dateRangeType: SkyDateRangeType.LastYear,
//       startDate,
//       endDate
//     };
//   }

//   public get nextFiscalYear(): SkyDateRange {
//     const start = new Date();
//     start.setDate(1);
//     start.setFullYear(start.getFullYear() + 1);

//     const { startDate, endDate } = this.getClosestFiscalYearRange(start);

//     return {
//       dateRangeType: SkyDateRangeType.NextFiscalYear,
//       startDate,
//       endDate
//     };
//   }

//   public get nextMonth(): SkyDateRange {
//     const startDate = new Date();
//     startDate.setDate(1);
//     startDate.setMonth(startDate.getMonth() + 1);

//     const endDate = new Date();
//     endDate.setDate(1);
//     endDate.setMonth(endDate.getMonth() + 2);
//     endDate.setDate(0);

//     return {
//       dateRangeType: SkyDateRangeType.NextMonth,
//       startDate,
//       endDate
//     };
//   }

//   public get nextQuarter(): SkyDateRange {
//     const startDate = new Date();
//     startDate.setDate(1);

//     const endDate = new Date();
//     endDate.setDate(1);

//     const beginningOfQuarter = Math.floor((startDate.getMonth()) / 3) * 3;
//     if (beginningOfQuarter === 9) {
//       startDate.setMonth(0);
//       startDate.setFullYear(startDate.getFullYear() + 1);
//       endDate.setMonth(3);
//       endDate.setFullYear(endDate.getFullYear() + 1);
//       endDate.setDate(0);
//     } else if (beginningOfQuarter === 6) {
//       startDate.setMonth(9);
//       endDate.setMonth(0);
//       endDate.setFullYear(endDate.getFullYear() + 1);
//       endDate.setDate(0);
//     } else {
//       startDate.setMonth(beginningOfQuarter + 3);
//       endDate.setMonth(beginningOfQuarter + 4);
//       endDate.setDate(0);
//     }

//     return {
//       dateRangeType: SkyDateRangeType.NextQuarter,
//       startDate,
//       endDate
//     };
//   }

//   public get nextWeek(): SkyDateRange {
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - startDate.getDay() + 7);

//     const endDate = new Date();
//     endDate.setDate(endDate.getDate() - endDate.getDay() + 13);

//     return {
//       dateRangeType: SkyDateRangeType.NextWeek,
//       startDate,
//       endDate
//     };
//   }

//   public get nextYear(): SkyDateRange {
//     const startDate = new Date();
//     startDate.setDate(1);
//     startDate.setMonth(0);
//     startDate.setFullYear(startDate.getFullYear() + 1);

//     const endDate = new Date();
//     endDate.setDate(1);
//     endDate.setMonth(0);
//     endDate.setFullYear(startDate.getFullYear() + 2);
//     endDate.setDate(0);

//     return {
//       dateRangeType: SkyDateRangeType.NextYear,
//       startDate,
//       endDate
//     };
//   }

//   public get thisFiscalYear(): SkyDateRange {
//     const start = new Date();
//     start.setDate(1);

//     const { startDate, endDate } = this.getClosestFiscalYearRange(start);

//     return {
//       dateRangeType: SkyDateRangeType.ThisFiscalYear,
//       startDate: startDate,
//       endDate: endDate
//     };
//   }

//   public get thisMonth(): SkyDateRange {
//     const firstDayOfMonth = new Date();
//     firstDayOfMonth.setDate(1);

//     const lastDayOfMonth = new Date();
//     lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
//     lastDayOfMonth.setDate(0);

//     return {
//       dateRangeType: SkyDateRangeType.ThisMonth,
//       startDate: firstDayOfMonth,
//       endDate: lastDayOfMonth
//     };
//   }

//   public get thisQuarter(): SkyDateRange {
//     const startDate = new Date();
//     startDate.setDate(1);

//     const endDate = new Date();
//     endDate.setDate(1);

//     const beginningOfQuarter = Math.floor((startDate.getMonth() - 1) / 3) * 3;
//     startDate.setMonth(beginningOfQuarter);
//     endDate.setMonth(beginningOfQuarter + 3);
//     endDate.setDate(0);

//     return {
//       dateRangeType: SkyDateRangeType.ThisQuarter,
//       startDate,
//       endDate
//     };
//   }

//   public get thisWeek(): SkyDateRange {
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - startDate.getDay());

//     const endDate = new Date();
//     endDate.setDate(endDate.getDate() - endDate.getDay() + 6);

//     return {
//       dateRangeType: SkyDateRangeType.ThisWeek,
//       startDate,
//       endDate
//     };
//   }

//   public get thisYear(): SkyDateRange {
//     const startDate = new Date();
//     startDate.setDate(1);
//     startDate.setMonth(0);

//     const endDate = new Date();
//     endDate.setDate(1);
//     endDate.setMonth(0);
//     endDate.setFullYear(endDate.getFullYear() + 1);
//     endDate.setDate(0);

//     return {
//       dateRangeType: SkyDateRangeType.ThisYear,
//       startDate,
//       endDate
//     };
//   }

//   public get today(): SkyDateRange {
//     const today = new Date();

//     return {
//       dateRangeType: SkyDateRangeType.Today,
//       startDate: today,
//       endDate: today
//     };
//   }

//   public get tomorrow(): SkyDateRange {
//     const today = new Date();
//     const tomorrow = new Date();

//     tomorrow.setDate(tomorrow.getDate() + 1);

//     return {
//       dateRangeType: SkyDateRangeType.Tomorrow,
//       startDate: today,
//       endDate: tomorrow
//     };
//   }

//   public get yesterday(): SkyDateRange {
//     const today = new Date();
//     const yesterday = new Date();

//     yesterday.setDate(yesterday.getDate() - 1);

//     return {
//       dateRangeType: SkyDateRangeType.Yesterday,
//       startDate: yesterday,
//       endDate: today
//     };
//   }

//   // #endregion

//   public get rangeTypeLabels(): { dateRangeType: SkyDateRangeType; label: string; }[] {
//     const customDateRanges: { dateRangeType: SkyDateRangeType; label: string; }[] = [
//       {
//         label: this.resourcesService.getStringForLocale(
//           { locale: 'en-US' },
//           'skyux_date_range_picker_format_label_specific_range'
//         ),
//         dateRangeType: SkyDateRangeType.SpecificRange
//       },
//       {
//         label: this.resourcesService.getStringForLocale(
//           { locale: 'en-US' },
//           'skyux_date_range_picker_format_label_before'
//         ),
//         dateRangeType: SkyDateRangeType.Before
//       },
//       {
//         label: this.resourcesService.getStringForLocale(
//           { locale: 'en-US' },
//           'skyux_date_range_picker_format_label_after'
//         ),
//         dateRangeType: SkyDateRangeType.Before
//       }
//     ];

//     return customDateRanges.concat(
//       this.dateRangeSettings.map((setting) => {
//         return {
//           label: this.resourcesService.getStringForLocale({ locale: 'en-US' }, setting.resourceKey),
//           dateRangeType: setting.rangeType
//         };
//       })
//     );
//   }

//   private dateRangeSettings: {
//     dateRangeType: SkyDateRangeType;
//     getRange: () => SkyDateRange;
//     resourceKey: string;
//   }[] = [
//     {
//       dateRangeType: SkyDateRangeType.AtAnyTime,
//       getRange: () => ({
//         dateRangeType: SkyDateRangeType.AtAnyTime,
//         startDate: undefined,
//         endDate: undefined
//       }),
//       resourceKey: 'skyux_date_range_picker_format_label_at_any_time'
//     },
//     {
//       dateRangeType: SkyDateRangeType.LastFiscalYear,
//       getRange: () => this.lastFiscalYear,
//       resourceKey: 'skyux_date_range_picker_format_label_last_fiscal_year'
//     },
//     {
//       dateRangeType: SkyDateRangeType.LastMonth,
//       getRange: () => this.lastMonth,
//       resourceKey: 'skyux_date_range_picker_format_label_last_month'
//     },
//     {
//       dateRangeType: SkyDateRangeType.LastQuarter,
//       getRange: () => this.lastQuarter,
//       resourceKey: 'skyux_date_range_picker_format_label_last_quarter'
//     },
//     {
//       dateRangeType: SkyDateRangeType.LastWeek,
//       getRange: () => this.lastWeek,
//       resourceKey: 'skyux_date_range_picker_format_label_last_week'
//     },
//     {
//       dateRangeType: SkyDateRangeType.LastYear,
//       getRange: () => this.lastYear,
//       resourceKey: 'skyux_date_range_picker_format_label_last_year'
//     },
//     {
//       dateRangeType: SkyDateRangeType.NextFiscalYear,
//       getRange: () => this.nextFiscalYear,
//       resourceKey: 'skyux_date_range_picker_format_label_next_fiscal_year'
//     },
//     {
//       dateRangeType: SkyDateRangeType.NextMonth,
//       getRange: () => this.nextMonth,
//       resourceKey: 'skyux_date_range_picker_format_label_next_month'
//     },
//     {
//       dateRangeType: SkyDateRangeType.NextQuarter,
//       getRange: () => this.nextQuarter,
//       resourceKey: 'skyux_date_range_picker_format_label_next_quarter'
//     },
//     {
//       dateRangeType: SkyDateRangeType.NextWeek,
//       getRange: () => this.nextWeek,
//       resourceKey: 'skyux_date_range_picker_format_label_next_week'
//     },
//     {
//       dateRangeType: SkyDateRangeType.NextYear,
//       getRange: () => this.nextYear,
//       resourceKey: 'skyux_date_range_picker_format_label_next_year'
//     },
//     {
//       dateRangeType: SkyDateRangeType.ThisFiscalYear,
//       getRange: () => this.thisFiscalYear,
//       resourceKey: 'skyux_date_range_picker_format_label_this_fiscal_year'
//     },
//     {
//       dateRangeType: SkyDateRangeType.ThisMonth,
//       getRange: () => this.thisMonth,
//       resourceKey: 'skyux_date_range_picker_format_label_this_month'
//     },
//     {
//       dateRangeType: SkyDateRangeType.ThisQuarter,
//       getRange: () => this.thisQuarter,
//       resourceKey: 'skyux_date_range_picker_format_label_this_quarter'
//     },
//     {
//       dateRangeType: SkyDateRangeType.ThisWeek,
//       getRange: () => this.thisWeek,
//       resourceKey: 'skyux_date_range_picker_format_label_this_week'
//     },
//     {
//       dateRangeType: SkyDateRangeType.ThisYear,
//       getRange: () => this.thisYear,
//       resourceKey: 'skyux_date_range_picker_format_label_this_year'
//     },
//     {
//       dateRangeType: SkyDateRangeType.Today,
//       getRange: () => this.today,
//       resourceKey: 'skyux_date_range_picker_format_label_today'
//     },
//     {
//       dateRangeType: SkyDateRangeType.Tomorrow,
//       getRange: () => this.tomorrow,
//       resourceKey: 'skyux_date_range_picker_format_label_tomorrow'
//     },
//     {
//       dateRangeType: SkyDateRangeType.Yesterday,
//       getRange: () => this.yesterday,
//       resourceKey: 'skyux_date_range_picker_format_label_yesterday'
//     }
//   ];

//   constructor(
//     private resourcesService: SkyLibResourcesService
//   ) { }

//   public getRelativeDateRange(dateRangeType: SkyDateRangeType): SkyDateRange {
//     for (let i = 0, len = this.dateRangeSettings.length; i < len; i++) {
//       if (this.dateRangeSettings[i].rangeType === rangeType) {
//         return this.dateRangeSettings[i].getRange();
//       }
//     }
//   }

//   private getClosestFiscalYearRange(startDate: Date): { startDate: Date, endDate: Date } {
//     const endDate = new Date(startDate);

//     if (startDate.getMonth() >= 9) {
//       startDate.setMonth(9);
//       endDate.setFullYear(startDate.getFullYear() + 1);
//       endDate.setMonth(9);
//       endDate.setDate(0);
//     } else {
//       startDate.setFullYear(startDate.getFullYear() - 1);
//       startDate.setMonth(9);
//       endDate.setMonth(9);
//       endDate.setDate(0);
//     }

//     return {
//       startDate,
//       endDate
//     };
//   }
// }
