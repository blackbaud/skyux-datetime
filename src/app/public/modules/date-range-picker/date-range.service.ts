import {
  Injectable
} from '@angular/core';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/operator/first';

import {
  SkyDateRangeCalculatorArgs
} from './date-range-calculator-args';

import {
  SkyDateRangeCalculatorConfig
} from './date-range-calculator-config';

import {
  SkyDateRangeCalculatorId
} from './date-range-calculator-id';

import {
  SkyDateRangeCalculatorInstance
} from './date-range-calculator-instance';

import {
  SkyDateRangeCalculatorType
} from './date-range-calculator-type';

import {
  SkyDateRangeCalculator
} from './date-range-calculator';

import {
  SkyDateRangeValidationResult
} from './date-range-validation-result';

import {
  SkyDateRangeRelativeValue
} from './date-range-relative-value';
import { SkyDateRangeCalculation } from './date-range-calculation';
import { SkyDateRange } from './date-range';

@Injectable()
export class SkyDateRangeService {
  private static calculators: SkyDateRangeCalculator[] = [];

  // Start the count higher than the number of available values
  // provided in the SkyDateRangeCalculatorId enum.
  private static uniqueId = 1000;

  private calculatorConfigs: {
    [id: number]: SkyDateRangeCalculatorArgs
  } = {

    [SkyDateRangeCalculatorId.AnyTime]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_any_time',
      getValue: () => ({})
    },

    [SkyDateRangeCalculatorId.Before]: {
      type: SkyDateRangeCalculatorType.Before,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_before',
      getValue: (startDate, endDate) => ({ endDate })
    },

    [SkyDateRangeCalculatorId.After]: {
      type: SkyDateRangeCalculatorType.After,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_after',
      getValue: (startDate) => ({ startDate })
    },

    [SkyDateRangeCalculatorId.SpecificRange]: {
      type: SkyDateRangeCalculatorType.Range,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_specific_range',
      getValue: (startDate, endDate) => ({ startDate, endDate }),
      validate: (startDate, endDate) => {
        if (
          startDate &&
          endDate &&
          startDate > endDate
        ) {
          return 'endDateBeforeStartDate';
        }
      }
    },

    [SkyDateRangeCalculatorId.LastFiscalYear]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_last_fiscal_year',
      getValue: () => SkyDateRangeRelativeValue.lastFiscalYear
    },

    [SkyDateRangeCalculatorId.LastMonth]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_last_month',
      getValue: () => SkyDateRangeRelativeValue.lastMonth
    },

    [SkyDateRangeCalculatorId.LastQuarter]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_last_quarter',
      getValue: () => SkyDateRangeRelativeValue.lastQuarter
    },

    [SkyDateRangeCalculatorId.LastWeek]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_last_week',
      getValue: () => SkyDateRangeRelativeValue.lastWeek
    },

    [SkyDateRangeCalculatorId.LastYear]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_last_year',
      getValue: () => SkyDateRangeRelativeValue.lastYear
    },

    [SkyDateRangeCalculatorId.NextFiscalYear]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_next_fiscal_year',
      getValue: () => SkyDateRangeRelativeValue.nextFiscalYear
    },

    [SkyDateRangeCalculatorId.NextMonth]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_next_month',
      getValue: () => SkyDateRangeRelativeValue.nextMonth
    },

    [SkyDateRangeCalculatorId.NextQuarter]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_next_quarter',
      getValue: () => SkyDateRangeRelativeValue.nextQuarter
    },

    [SkyDateRangeCalculatorId.NextWeek]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_next_week',
      getValue: () => SkyDateRangeRelativeValue.nextWeek
    },

    [SkyDateRangeCalculatorId.NextYear]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_next_year',
      getValue: () => SkyDateRangeRelativeValue.nextYear
    },

    [SkyDateRangeCalculatorId.ThisFiscalYear]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_this_fiscal_year',
      getValue: () => SkyDateRangeRelativeValue.thisFiscalYear
    },

    [SkyDateRangeCalculatorId.ThisMonth]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_this_month',
      getValue: () => SkyDateRangeRelativeValue.thisMonth
    },

    [SkyDateRangeCalculatorId.ThisQuarter]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_this_quarter',
      getValue: () => SkyDateRangeRelativeValue.thisQuarter
    },

    [SkyDateRangeCalculatorId.ThisWeek]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_this_week',
      getValue: () => SkyDateRangeRelativeValue.thisWeek
    },

    [SkyDateRangeCalculatorId.ThisYear]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_this_year',
      getValue: () => SkyDateRangeRelativeValue.thisYear
    },

    [SkyDateRangeCalculatorId.Today]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_today',
      getValue: () => SkyDateRangeRelativeValue.today
    },

    [SkyDateRangeCalculatorId.Tomorrow]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_tomorrow',
      getValue: () => SkyDateRangeRelativeValue.tomorrow
    },

    [SkyDateRangeCalculatorId.Yesterday]: {
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_yesterday',
      getValue: () => SkyDateRangeRelativeValue.yesterday
    }
  };

  constructor(
    private resourcesService: SkyLibResourcesService
  ) {
    this.createDefaultCalculators();
  }

  public createCalculator(config: SkyDateRangeCalculatorConfig): SkyDateRangeCalculatorInstance {
    const newId = SkyDateRangeService.uniqueId++;
    const calculator = new SkyDateRangeCalculator(newId, config);

    SkyDateRangeService.calculators.push(calculator);

    return this.parseCalculatorInstance(calculator);
  }

  public getCalculatorInstances(
    ids: SkyDateRangeCalculatorId[]
  ): Promise<SkyDateRangeCalculatorInstance[]> {
    const tasks: Observable<void>[] = [];

    const calculators: SkyDateRangeCalculator[] = ids.map((id) => {
      return this.getCalculatorById(id);
    });

    calculators.forEach((calculator) => {
      if (calculator.shortDescriptionResourceKey) {
        tasks.push(
          this.resourcesService.getString(calculator.shortDescriptionResourceKey)
            .first()
            .map((value) => {
              calculator.shortDescription = value;
            })
        );
      }
    });

    return new Promise((resolve) => {
      Observable.forkJoin(tasks).first().subscribe(() => {
        const result = calculators.map((calculator) => {
          return this.parseCalculatorInstance(calculator);
        });

        resolve(result);
      });
    });
  }

  public getValue(
    id: SkyDateRangeCalculatorId,
    value: SkyDateRange = { }
  ): SkyDateRangeCalculation {
    const calculator = this.getCalculatorById(id);

    return calculator.getValue(value.startDate, value.endDate);
  }

  public validate(
    id: SkyDateRangeCalculatorId,
    value: SkyDateRange = { }
  ): {
    calculatorId: SkyDateRangeCalculatorId,
    error: {
      [_: string]: boolean
    }
  } {
    const calculator = this.getCalculatorById(id);

    const result: SkyDateRangeValidationResult = calculator.validate(
      value.startDate,
      value.endDate
    );

    if (result) {
      const formatted: any = {};

      formatted[result.trim().replace(/ /g, '')] = true;

      return {
        calculatorId: calculator.calculatorId,
        error: formatted
      };
    }
  }

  public getCalculatorInstanceById(id: SkyDateRangeCalculatorId): SkyDateRangeCalculatorInstance {
    const calculator = this.getCalculatorById(id);

    return this.parseCalculatorInstance(calculator);
  }

  public parseDateRangeCalculation(value: any = { }): SkyDateRangeCalculation {
    /* tslint:disable:no-null-keyword */
    if (value.startDate === undefined) {
      value.startDate = null;
    }

    if (value.endDate === undefined) {
      value.endDate = null;
    }
    /* tslint:enable */

    // ID will come in as a string if derived from a template control.
    if (typeof value.calculatorId === 'string') {
      value.calculatorId = parseInt(value.calculatorId, 10);
    }

    return value as SkyDateRangeCalculation;
  }

  private getCalculatorById(
    id: SkyDateRangeCalculatorId
  ): SkyDateRangeCalculator {
    const calculatorId: number = parseInt(id as any, 10);
    return SkyDateRangeService.calculators.find((calculator) => {
      return (calculator.calculatorId === calculatorId);
    });
  }

  private parseCalculatorInstance(value: any): SkyDateRangeCalculatorInstance {
    return {
      calculatorId: value.calculatorId,
      type: value.type,
      shortDescription: value.shortDescription
    };
  }

  private createDefaultCalculators(): void {
    SkyDateRangeService.calculators = Object.keys(this.calculatorConfigs).map((key) => {
      const id = parseInt(key, 10);
      return new SkyDateRangeCalculator(id, this.calculatorConfigs[id]);
    });
  }
}
