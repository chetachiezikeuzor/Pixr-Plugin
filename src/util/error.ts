/* ------------------------------------------------------------------
 **  —— Credits go to:
 **  —— SilentVoid13's Templater Plugin: https://github.com/SilentVoid13/Templater
 ** -----------------------------------------------------------------*/

import { logError } from "./log";

export class GetError extends Error {
    constructor(msg: string, public console_msg?: string) {
        super(msg);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export async function errorWrapper<T>(
    fn: () => Promise<T>,
    msg: string
): Promise<T> {
    try {
        return await fn();
    } catch (e) {
        if (!(e instanceof GetError)) {
            logError(new GetError(msg, e.message));
        } else {
            logError(e);
        }
        return null;
    }
}

export function errorWrapperSync<T>(fn: () => T, msg: string): T {
    try {
        return fn();
    } catch (e) {
        logError(new GetError(msg, e.message));
        return null;
    }
}
