export class Logger {
  static ERROR = 'ERROR';
  static INFO = 'INFO';
  static DEBUG = 'DEBUG';

  static #currentLevel = Logger.INFO;

  // ANSI エスケープコード
  static #RED = '\x1b[31m';
  static #YELLOW = '\x1b[33m';
  static #GREEN = '\x1b[32m';
  static #RESET = '\x1b[0m';

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
   * エラーログを出力（赤色）
   * @param {string} message - ログメッセージ
   */
  static error(message) {
    console.error(`${Logger.#RED}[ERROR] ${message}${Logger.#RESET}`);
  }

  /**
   * 警告ログを出力（黄色）
   * @param {string} message - ログメッセージ
   */
  static warn(message) {
    console.warn(`${Logger.#YELLOW}[WARN] ${message}${Logger.#RESET}`);
  }


  /**
   * 情報ログを出力（緑色）
   * @param {string} message - ログメッセージ
   */
  static info(message) {
    if ([Logger.INFO, Logger.DEBUG].includes(Logger.#currentLevel)) {
      console.log(`${Logger.#GREEN}[INFO] ${message}${Logger.#RESET}`);
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