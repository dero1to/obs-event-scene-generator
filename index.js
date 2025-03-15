import OBSWebSocket from 'obs-websocket-js';
import 'dotenv/config';
import { Logger } from './logger.js';
import { ObsCleaner } from './obsCleaner.js';
import { ObsSceneCreator } from './obsSceneCreator.js';
import { ObsSceneManager } from './obsSceneManager.js';

const obs = new OBSWebSocket();

// OBSへの接続設定
const connect = async () => {
  try {
    // ログレベルをDEBUGに設定
    Logger.setLevel(Logger.DEBUG);

    const { obsWebSocketVersion } = await obs.connect(process.env.OBS_WEBSOCKET_URL, 
      process.env.OBS_WEBSOCKET_PASSWORD);
    Logger.info(`OBS WebSocketに接続しました。バージョン: ${obsWebSocketVersion}`);

    // クリーンアップを実行
    const cleaner = new ObsCleaner(obs);
    await cleaner.cleanAll();

    // シーンとソースを作成
    const creator = new ObsSceneCreator(obs);
    await creator.createSampleScene();

    // シーン管理
    const manager = new ObsSceneManager(obs);
    await manager.setStudioMode(true);
    await manager.setProgramScene('サンプルシーン');

    // WebSocket接続を閉じて、プログラムを終了
    await setTimeout(() => {}, 5000);
    await obs.disconnect();
    Logger.info('すべての操作が完了しました');
    process.exit(0);

  } catch (error) {
    Logger.error('エラーが発生しました: ' + error);
    await setTimeout(() => {}, 5000);
    await obs.disconnect();
    process.exit(1);
  }
};

// WebSocketの切断イベントを監視
obs.on('ConnectionClosed', data => {
  Logger.info('OBS WebSocketが切断されました');
});

// 接続を開始
connect();