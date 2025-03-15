import OBSWebSocket from 'obs-websocket-js';
import { Logger } from '../../logger.js';
import { SceneModule } from './modules/scene.js';
import { InputModule } from './modules/input.js';
import { OutputModule } from './modules/output.js';

export class OBSClient {
  /**
   * OBSクライアントの初期化
   * @param {Object} [options={}] 設定オプション
   */
  constructor(options = {}) {
    this._connection = new OBSWebSocket();
    this._options = {
      retryAttempts: options.retryAttempts || 3,
      retryDelay: options.retryDelay || 3000,
      autoReconnect: options.autoReconnect ?? false,
      ...options
    };
    this._isConnected = false;

    // サブモジュールの初期化
    this.scenes = new SceneModule(this);
    this.inputs = new InputModule(this);
    this.outputs = new OutputModule(this);

    this._initializeEventHandlers();
  }

  /**
   * 基本イベントハンドラの初期化
   * @private
   */
  _initializeEventHandlers() {
    this._connection.on('ConnectionOpened', () => {
      this._isConnected = true;
      Logger.info('OBS WebSocket接続が確立されました');
    });

    this._connection.on('ConnectionClosed', () => {
      this._isConnected = false;
      Logger.info('OBS WebSocket接続が切断されました');
      
      if (this._options.autoReconnect) {
        this._handleReconnection();
      }
    });

    this._connection.on('error', error => {
      Logger.error('OBS WebSocketエラー:', error);
    });
  }

  /**
   * 再接続処理
   * @private
   */
  async _handleReconnection() {
    let attempts = 0;
    while (attempts < this._options.retryAttempts && !this._isConnected) {
      try {
        Logger.info(`再接続を試みています... (${attempts + 1}/${this._options.retryAttempts})`);
        await this.connect();
        break;
      } catch (error) {
        attempts++;
        if (attempts < this._options.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, this._options.retryDelay));
        }
      }
    }
  }

  /**
   * OBS WebSocketサーバーに接続
   * @param {Object} [params={}] 接続パラメータ
   * @param {string} [params.url=process.env.OBS_WEBSOCKET_URL] WebSocket URL
   * @param {string} [params.password=process.env.OBS_WEBSOCKET_PASSWORD] WebSocket パスワード
   * @returns {Promise<void>}
   */
  async connect(params = {}) {
    try {
      const url = params.url || process.env.OBS_WEBSOCKET_URL || 'ws://localhost:4455';
      const password = params.password || process.env.OBS_WEBSOCKET_PASSWORD;

      if (!url) {
        throw new Error('WebSocket URLが指定されていません');
      }

      // 接続オプションの設定
      const connectionParams = {};

      // パスワードが設定されている場合のみ追加
      if (password) {
        connectionParams.password = password;
      }

      const { obsWebSocketVersion } = await this._connection.connect(url, password);
      Logger.info(`OBS WebSocket接続完了 (v${obsWebSocketVersion})`);
    } catch (error) {
      Logger.error('接続エラー:', error);
      throw error;
    }
  }

  /**
   * OBS WebSocketサーバーから切断
   * @returns {Promise<void>}
   */
  async disconnect() {
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      await this._connection.disconnect();
      Logger.info('OBS WebSocket切断完了');
    } catch (error) {
      Logger.error('切断エラー:', error);
      throw error;
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  /**
   * イベントリスナーを登録
   * @param {string} event イベント名
   * @param {Function} callback コールバック関数
   */
  on(event, callback) {
    this._connection.on(event, callback);
  }

  /**
   * イベントリスナーを削除
   * @param {string} event イベント名
   * @param {Function} callback コールバック関数
   */
  off(event, callback) {
    this._connection.off(event, callback);
  }

  /**
   * OBS WebSocketメソッドを直接呼び出し
   * @param {string} method メソッド名
   * @param {Object} [args={}] 引数
   * @returns {Promise<any>}
   */
  async call(method, args = {}) {
    try {
      return await this._connection.call(method, args);
    } catch (error) {
      Logger.error(`メソッド呼び出しエラー (${method}):`, error);
      throw error;
    }
  }

  /**
   * 接続状態を取得
   * @returns {boolean}
   */
  isConnected() {
    return this._isConnected;
  }

  /**
   * 基底WebSocketインスタンスを取得
   * @returns {OBSWebSocket}
   */
  get connection() {
    return this._connection;
  }
}