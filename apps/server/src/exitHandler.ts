import { cacheManager } from "./cacheManager";

function exitHandler(options: any, exitCode: any) {
    if (exitCode || exitCode === 0) {
        if (cacheManager.instance) {
            cacheManager.instance._delete('CACHED_FREE_PORTS')
        }
    }
    if (options.exit) process.exit();
}

export function initExitHandler() {
    process.stdin.resume();
    process.on('exit', exitHandler.bind(null, { cleanup: true }));

    process.on('SIGINT', exitHandler.bind(null, { exit: true }));

    process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

    process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
}


