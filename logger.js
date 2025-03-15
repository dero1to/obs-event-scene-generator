export class Logger {
  static ERROR = 'ERROR';
  static INFO = 'INFO';
  static DEBUG = 'DEBUG';

  static #currentLevel = Logger.INFO;

  /**
   * ログレベルを設定
   * @param {string} level - ログレベル (ERROR/INFO/DEBUG)
   */
  static setLevel(level) {
    if ([Logger.ERROR, Logger.INFO, Logger.DEBUG].includes(level)) {
      Logger.#currentLevel = level;
    }
  }

  /**
   * エラーログを出力
   * @param {string} message - ログメッセージ
   */
  static error(message) {
    console.error(`[ERROR] ${message}`);
  }

  /**
   * 情報ログを出力
   * @param {string} message - ログメッセージ
   */
  static info(message) {
    if ([Logger.INFO, Logger.DEBUG].includes(Logger.#currentLevel)) {
      console.log(`[INFO] ${message}`);
    }
  }

  /**
   * デバッグログを出力
   * @param {string} message - ログメッセージ
   */
  static debug(message) {
    if (Logger.#currentLevel === Logger.DEBUG) {
      console.log(`[DEBUG] ${message}`);
    }
  }
}