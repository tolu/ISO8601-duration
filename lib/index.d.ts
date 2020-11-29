/**
 * @description A module for parsing ISO8601 durations
 */
/**
 * The pattern used for parsing ISO8601 duration (PnYnMnDTnHnMnS).
 * This does not cover the week format PnW.
 */
export interface Duration {
    years: number;
    months: number;
    weeks: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}
export declare type PartialDuration = Partial<Duration>;
/**
 * The ISO8601 regex for matching / testing durations
 */
export declare const pattern: RegExp;
/**
 * Parse PnYnMnDTnHnMnS format to object
 */
export declare const parse: (durationString: string) => PartialDuration;
/**
 * Convert ISO8601 duration object to an end Date.
 */
export declare const end: (duration: Duration, startDate?: Date | undefined) => Date;
/**
 * Convert ISO8601 duration object to seconds
 */
export declare const toSeconds: (duration: PartialDuration, startDate?: Date | undefined) => number;
declare const _default: {
    end: (duration: Duration, startDate?: Date | undefined) => Date;
    toSeconds: (duration: Partial<Duration>, startDate?: Date | undefined) => number;
    pattern: RegExp;
    parse: (durationString: string) => Partial<Duration>;
};
export default _default;
