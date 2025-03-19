/**
 * OBS-SDK シーンモジュール 統合テスト
 * 
 * このテストは、実行中のOBSにWebSocketを使用して接続し、
 * シーンモジュールの機能を検証します。
 * テスト実行前にOBS WebSocketが有効であり、正しく設定されていることを確認してください。
 * 環境変数からデフォルト接続設定を取得します:
 * - OBS_WEBSOCKET_ADDRESS (例: ws://localhost:4444)
 * - OBS_WEBSOCKET_PASSWORD (例: 空文字列)
 * 
 * 注意: 本テストは実際にOBSに接続してテストを実施します。FakeModule等は使用しません。
 */

import 'dotenv/config';
import { ObsClient } from '../src/obs-sdk/client.js';

if (!process.env.OBS_WEBSOCKET_PASSWORD) {
  describe.skip("OBS SDK シーンモジュール 統合テスト (OBS認証パスワード未設定)", () => {});
} else {
  describe("OBS SDK シーンモジュール 統合テスト", () => {
    let client;

    beforeAll(async () => {
      const address = process.env.OBS_WEBSOCKET_ADDRESS || 'ws://localhost:4444';
      const password = process.env.OBS_WEBSOCKET_PASSWORD || '';
      client = new ObsClient({ address, password });
      await client.connect();
    }, 10000);

    afterAll(async () => {
      if (client) {
        await client.disconnect();
      }
    });

    test("利用可能なシーンの一覧が取得できること", async () => {
      const scenes = await client.scenes.list();
      expect(Array.isArray(scenes)).toBe(true);
      expect(scenes.length).toBeGreaterThan(0);
    });

    test("別のシーンに切り替えられること", async () => {
      let scenes = await client.scenes.list();
      if (scenes.length < 2) {
        for (let i = scenes.length; i < 2; i++) {
          await client.scenes.create(`テストシーン${i + 1}`);
        }
        scenes = await client.scenes.list();
      }

      const currentSceneName = await client.scenes.getProgramName();
      const targetScene = scenes.find(scene => scene.sceneName !== currentSceneName);
      expect(targetScene).toBeDefined();

      await client.scenes.switch(targetScene.sceneName);

      const updatedSceneName = await client.scenes.getProgramName();
      expect(updatedSceneName).toBe(targetScene.sceneName);

      // テスト後のクリーンアップとして元のシーンに戻す
      await client.scenes.switch(currentSceneName);
    });
  });
}