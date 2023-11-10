/* eslint-disable no-promise-executor-return */
export function sleep(durationInSeconds: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.round(durationInSeconds * 1000))
  );
}
