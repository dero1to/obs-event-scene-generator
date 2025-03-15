import 'dotenv/config';
import { Logger } from './logger.js';
import { ObsConnection } from './obsConnection.js';
import { ObsCleaner } from './obsCleaner.js';
import { ObsSceneCreator } from './obsSceneCreator.js';
import { ObsSceneManager } from './obsSceneManager.js';

const main = async () => {
  // ログレベルをDEBUGに設定
  Logger.setLevel(Logger.DEBUG);

  const connection = new ObsConnection();
  
  try {
    // OBSに接続
    const obs = await connection.connect();

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

    // OBSから切断
    await connection.disconnect();
    Logger.info('すべての操作が完了しました');
    process.exit(0);

  } catch (error) {
    Logger.error('エラーが発生しました: ' + error);
    await connection.disconnect();
    process.exit(1);
  }
};

// プログラムを実行
main();