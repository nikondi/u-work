import {ParsedLine} from "../types";

const filter = ['renderWithHooks', 'mountIndeterminateComponent', 'beginWork', 'beginWork$1', 'performUnitOfWork', 'workLoopSync', 'renderRootSync', 'recoverFromConcurrentError', 'performSyncWorkOnRoot', 'flushSyncCallbacks', 'flushSync', 'scheduleRefresh', 'renderer_attach/d.scheduleRefresh', 'setTimeout'];

export function parseStack(stack: string): ParsedLine[] {
  return stack
    .split('\n')
    .map((line) => ((/(?<function>.*)@(?<file>.*):(?<line>.*):(?<char>.*)/gm).exec(line)?.groups || line) as ParsedLine)
    .filter((line) => typeof line == 'string' || (!filter.includes(line.function)));
}
