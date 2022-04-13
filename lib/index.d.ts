/**
 * @description A module for parsing ISO8601 durations
 */
export interface Duration {
    years?: number;
    months?: number;
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
}
/**
 * The ISO8601 regex for matching / testing durations
 */
export declare const pattern: RegExp;
/** Parse PnYnMnDTnHnMnS format to object */
export declare const parse: (durationString: string) => Duration;
/** Convert ISO8601 duration object to an end Date. */
export declare const end: (durationInput: Duration, startDate?: Date) => Date;
/** Convert ISO8601 duration object to seconds */
export declare const toSeconds: (durationInput: Duration, startDate?: Date) => number;
declare const _default: {
    end: (durationInput: Duration, startDate?: Date) => Date;
    toSeconds: (durationInput: Duration, startDate?: Date) => number;
    pattern: RegExp;
    parse: (durationString: string) => Duration;
};
export default _default;
