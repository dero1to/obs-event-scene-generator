/**
 * OBS-SDK ObsClient 統合テスト
 * 
 * このテストは、実際にOBS WebSocketサーバーに接続して、ObsClientの
 * 基本的な接続・切断機能を検証します。
 * テスト実行前にOBS WebSocketが有効であり、正しく設定されていることを確認してください。
 * 環境変数:
 *   - OBS_WEBSOCKET_ADDRESS (例: ws://localhost:4444)
 *   - OBS_WEBSOCKET_PASSWORD (例: 空文字列)
 * 
 * 注意: 本テストは実際のOBSに接続します。OBS認証パスワードが未設定の場合はテストをスキップします。
 */

import 'dotenv/config';
import { ObsClient } from '../src/obs-sdk/client.js';

if (!process.env.OBS_WEBSOCKET_PASSWORD) {
  describe.skip('ObsClient 統合テスト (OBS認証パスワード未設定)', () => {});
} else {
  describe('ObsClient 統合テスト', () => {
    let client;
    const address = process.env.OBS_WEBSOCKET_ADDRESS || 'ws://localhost:4444';
    const password = process.env.OBS_WEBSOCKET_PASSWORD;

    beforeAll(async () => {
      client = new ObsClient({ address, password });
      await client.connect();
    });

    afterAll(async () => {
      if (client) {
        await client.disconnect();
      }
    });

    test('接続後にisConnected()がtrueを返すこと', () => {
      expect(client.isConnected()).toBe(true);
    });

    test('切断後にisConnected()がfalseを返すこと', async () => {
      await client.disconnect();
      expect(client.isConnected()).toBe(false);
    });
  });
}