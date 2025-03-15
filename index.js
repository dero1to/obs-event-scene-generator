import OBSWebSocket from 'obs-websocket-js';
import 'dotenv/config';
import { ObsCleaner } from './obsCleaner.js';
import { ObsSceneCreator } from './obsSceneCreator.js';

const obs = new OBSWebSocket();

// OBSへの接続設定
const connect = async () => {
  try {
    const { obsWebSocketVersion } = await obs.connect(process.env.OBS_WEBSOCKET_URL, 
      process.env.OBS_WEBSOCKET_PASSWORD);
    console.log(`OBS WebSocketに接続しました。バージョン: ${obsWebSocketVersion}`);

    // クリーンアップを実行
    const cleaner = new ObsCleaner(obs);
    await cleaner.cleanAll();

    // シーンとソースを作成
    const creator = new ObsSceneCreator(obs);
    await creator.createSampleScene();

    // WebSocket接続を閉じて、プログラムを終了
    await obs.disconnect();
    console.log('すべての操作が完了しました');
    process.exit(0);

  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
};

// WebSocketの切断イベントを監視
obs.on('ConnectionClosed', data => {
  console.log('OBS WebSocketが切断されました');
});

// 接続を開始
connect();