export type LogEntry = {
  _time: number;
  cid?: string;
  channel?: string;
  level?: string;
  message?: string;
  context?: string;
  [key: string]: unknown;
};
