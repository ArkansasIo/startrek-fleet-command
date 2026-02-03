export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  component: string;
  message: string;
  data?: any;
  error?: Error;
}

export class Logger {
  private component: string;
  private static globalLogLevel: LogLevel = LogLevel.INFO;
  private static logHandlers: ((entry: LogEntry) => void)[] = [];

  constructor(component: string) {
    this.component = component;
  }

  static setLogLevel(level: LogLevel): void {
    Logger.globalLogLevel = level;
  }

  static addLogHandler(handler: (entry: LogEntry) => void): void {
    Logger.logHandlers.push(handler);
  }

  private log(
    level: LogLevel,
    message: string,
    data?: any,
    error?: Error,
  ): void {
    if (level < Logger.globalLogLevel) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      component: this.component,
      message,
      data,
      error,
    };

    // Console output
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[level];
    const logMessage = `[${timestamp}] ${levelName} [${this.component}] ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, data);
        break;
      case LogLevel.INFO:
        console.info(logMessage, data);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, data);
        break;
      case LogLevel.ERROR:
        console.error(logMessage, error || data);
        break;
    }

    // Call registered handlers
    Logger.logHandlers.forEach((handler) => {
      try {
        handler(entry);
      } catch (err) {
        console.error("Log handler failed:", err);
      }
    });
  }

  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, error?: Error | any): void {
    this.log(
      LogLevel.ERROR,
      message,
      undefined,
      error instanceof Error ? error : undefined,
    );
  }
}
