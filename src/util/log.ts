/* ------------------------------------------------------------------
 **  —— Credits go to:
 **  —— SilentVoid13's Templater Plugin: https://github.com/SilentVoid13/Templater
 ** -----------------------------------------------------------------*/

import { Notice } from "obsidian";
import { GetError } from "./error";

export function logError(e: Error | GetError): void {
    const notice = new Notice("", 8000);
    if (e instanceof GetError && e.console_msg) {
        // @ts-ignore
        notice.noticeEl.innerHTML = `<b>Error</b>:<br/>${e.message}<br/>Check console for more information.`;
        console.error(`Error:`, e.message, "\n", e.console_msg);
    } else {
        // @ts-ignore
        notice.noticeEl.innerHTML = `<b>Error</b>:<br/>${e.message}`;
    }
}
