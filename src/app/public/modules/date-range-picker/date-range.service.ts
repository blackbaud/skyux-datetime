import {
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  Observable
} from 'rxjs/Observable';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/first';

import {
  SkyDateRangeCalculatorConfig
} from './date-range-calculator-config';

import {
  SkyDateRangeCalculatorId
} from './date-range-calculator-id';

import {
  SkyDateRangeCalculator
} from './date-range-calculator';

import {
  SKY_DEFAULT_CALCULATOR_CONFIGS
} from './date-range-default-calculator-configs';

// Start the count higher than the number of available values
// provided in the SkyDateRangeCalculatorId enum.
let uniqueId = 1000;

@Injectable()
export class SkyDateRangeService implements OnDestroy {
  private calculatorReadyStream = new BehaviorSubject<boolean>(false);
  private calculatorConfigs: {[id: number]: SkyDateRangeCalculatorConfig} = {};
  private calculators: SkyDateRangeCalculator[] = [];
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private resourcesService: SkyLibResourcesService
  ) {
    this.createDefaultCalculators();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public createCalculator(config: SkyDateRangeCalculatorConfig): SkyDateRangeCalculator {
    const newId = uniqueId++;
    const calculator = new SkyDateRangeCalculator(newId, config);

    this.calculators.push(calculator);

    return calculator;
  }

  public getCalculators(ids: SkyDateRangeCalculatorId[]): Promise<SkyDateRangeCalculator[]> {
    const calculators = ids.map((id) => {
      return this.getCalculatorById(id);
    });

    return new Promise((resolve) => {
      this.calculatorReadyStream
        .takeUntil(this.ngUnsubscribe)
        .subscribe(() => {
          resolve(calculators);
        });
    });
  }

  public getCalculatorById(id: SkyDateRangeCalculatorId): SkyDateRangeCalculator {
    const calculatorId = parseInt(id as any, 10);
    return this.calculators.find((calculator) => {
      return (calculator.calculatorId === calculatorId);
    });
  }

  private createDefaultCalculators(): void {
    const tasks: Observable<void>[] = [];

    // Get resource strings for short descriptions.
    SKY_DEFAULT_CALCULATOR_CONFIGS.forEach((defaultConfig) => {
      const config = {
        getValue: defaultConfig.getValue,
        validate: defaultConfig.validate,
        shortDescription: '',
        type: defaultConfig.type
      };

      tasks.push(
        this.resourcesService
          .getString(defaultConfig.shortDescriptionResourceKey)
          .first()
          .map((value) => {
            config.shortDescription = value;
          })
      );

      this.calculatorConfigs[defaultConfig.calculatorId] = config;
    });

    Observable.forkJoin(tasks).first().subscribe(() => {
      const calculators = Object.keys(this.calculatorConfigs).map((key) => {
        const id = parseInt(key, 10);
        return new SkyDateRangeCalculator(id, this.calculatorConfigs[id]);
      });

      this.calculators = calculators;
      this.calculatorReadyStream.next(true);
    });
  }
}
