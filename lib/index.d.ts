/**
 * The ISO8601 regex for matching / testing durations
 */
export const pattern: RegExp;
export function parse(durationString: string): Object;
export function end(duration: Object, startDate?: Date | undefined): Date;
export function toSeconds(duration: Object, startDate?: Date | undefined): number;
declare namespace _default {
    export { end };
    export { toSeconds };
    export { pattern };
    export { parse };
}
export default _default;
