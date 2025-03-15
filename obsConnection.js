import OBSWebSocket from 'obs-websocket-js';
import { Logger } from './logger.js';

export class ObsConnection {
  constructor() {
    this.obs = new OBSWebSocket();
    this.setupEventHandlers();
  }

  /**
   * イベントハンドラの設定
   */
  setupEventHandlers() {
    this.obs.on('ConnectionClosed', () => {
      Logger.info('OBS WebSocketが切断されました');
    });
  }

  /**
   * OBSに接続
   * @returns {Promise<OBSWebSocket>} 接続済みのOBSWebSocketインスタンス
   */
  async connect() {
    try {
      const { obsWebSocketVersion } = await this.obs.connect(
        process.env.OBS_WEBSOCKET_URL,
        process.env.OBS_WEBSOCKET_PASSWORD
      );
      Logger.info(`OBS WebSocketに接続しました。バージョン: ${obsWebSocketVersion}`);
      return this.obs;
    } catch (error) {
      Logger.error('接続エラー: ' + error);
      throw error;
    }
  }

  /**
   * OBSとの接続を切断
   */
  async disconnect() {
    try {
      await this.obs.disconnect();
      Logger.debug('OBS WebSocketから切断しました');
    } catch (error) {
      Logger.error('切断エラー: ' + error);
      throw error;
    }
  }
}