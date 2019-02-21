// import {
//   SkyDateRangeCalculatorConfig
// } from './date-range-calculator-config';

// import { SkyDateRangeCalculatorHandle } from './date-range-calculator-handle';
// import { SkyDateRangeCalculatorType } from './date-range-calculator-type';
// import { SkyDateRange } from './date-range';

// // Start with a number that's safely larger than the SkyDateRangeCalculatorHandle length.
// let uniqueId = 100;

// export class SkyDateRangeCalculator {
//   public get caption(): string {
//     return this._caption;
//   }

//   public get handle(): SkyDateRangeCalculatorHandle {
//     return this._handle;
//   }

//   public get type(): SkyDateRangeCalculatorType {
//     return this._type;
//   }

//   private _caption: string;
//   private _handle: SkyDateRangeCalculatorHandle;
//   public _type: SkyDateRangeCalculatorType;

//   constructor(
//     private config: SkyDateRangeCalculatorConfig
//   ) {
//     this._caption = config.captionResourceKey;
//     this._handle = uniqueId++;
//     this._type = config.type;
//   }

//   public getValue(startDate: Date, endDate: Date): SkyDateRange {
//     return this.config.getValue(startDate, endDate);
//   }
// }
