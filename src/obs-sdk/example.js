import { OBSClient } from './client.js';
import dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();

async function example() {
  // OBSクライアントの初期化（autoReconnect無効）
  const obs = new OBSClient({
    autoReconnect: false,
    retryAttempts: 3
  });

  try {
    // OBSに接続（URLとパスワードは環境変数から自動的に読み込まれます）
    await obs.connect();

    // 接続成功の確認
    if (!obs.isConnected()) {
      throw new Error('OBSへの接続に失敗しました');
    }

    // シーン操作の例
    console.log('=== シーン操作 ===');
    // console.log(await obs.scenes.exists('サンプルシーン1'));    
    await obs.scenes.removeAll();

    // 入力ソース操作の例
    console.log('\n=== 入力ソース操作 ===');
    const inputs = await obs.inputs.list();
    console.log('入力ソース一覧:', inputs.map(input => input.inputName));

    // 出力操作の例
    console.log('\n=== 出力操作 ===');
    // const outputStatus = await obs.outputs.getStatus();
    // console.log('出力ステータス:', outputStatus);

    // イベントリスナーの例
    obs.on('SceneItemEnableStateChanged', data => {
      console.log('シーンアイテムの表示状態が変更されました:', data);
    });
    
    if (obs.isConnected()) {
      await obs.disconnect();
    }

  } catch (error) {
    console.error('エラーが発生しました:', error);
    // 接続中のままエラーが発生した場合は切断を試みる
    if (obs.isConnected()) {
      try {
        await obs.disconnect();
      } catch (disconnectError) {
        console.error('切断中にエラーが発生しました:', disconnectError);
      }
    }
    process.exit(1);
  }
}

// 実行
example();