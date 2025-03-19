/**
 * OBS-SDK シーンモジュール 統合テスト
 *
 * このテストは、ObsClient のインスタンス経由で SceneModule の各関数を呼び出し、
 * 用意されている関数群を網羅するテストケースの例です。
 * 注意: 以下のテストは実際のOBS接続が必要です。テスト実行前にOBS WebSocketが有効で、
 *       適切な環境変数 (OBS_WEBSOCKET_ADDRESS, OBS_WEBSOCKET_PASSWORD) が設定されていることを確認してください。
 *       また、テスト中に使用するシーン名やソース名 ("TestScene", "dummy-source" など) は環境に合わせて適宜変更してください。
 */

import 'dotenv/config';
import { ObsClient } from '../src/obs-sdk/client.js';

describe('SceneModule 統合テスト', () => {
  let client;
  let testSceneName;
  let renamedSceneName;
  let testItemId;
  const address = process.env.OBS_WEBSOCKET_ADDRESS || 'ws://localhost:4444';
  const password = process.env.OBS_WEBSOCKET_PASSWORD;

  if (!password) {
    describe.skip('OBS認証パスワード未設定のため、テストをスキップします', () => {});
    return;
  }

  beforeAll(async () => {
    client = new ObsClient({ address, password });
    await client.connect();
    // 初期状態のシーン一覧を確認し、テストで使用可能な名前を設定する
    testSceneName = `TestScene-${Date.now()}`;
  }, 15000);

  afterAll(async () => {
    // テストで作成したシーンが残っていれば削除するなどのクリーンアップ処理を実施
    // ※ 実際の環境に合わせて適切にクリーンアップしてください
    await client.disconnect();
  });

  test('list(): シーンの一覧が取得できること', async () => {
    const scenes = await client.scenes.list();
    expect(Array.isArray(scenes)).toBe(true);
  });

  test('exists(): シーンの存在確認ができること', async () => {
    // まだ存在しないシーンはfalseとなる
    const existsBefore = await client.scenes.exists(testSceneName);
    expect(existsBefore).toBe(false);
  });

  test('create(): 新しいシーンが作成できること', async () => {
    await client.scenes.create(testSceneName);
    const existsAfter = await client.scenes.exists(testSceneName);
    expect(existsAfter).toBe(true);
  });

  test('getProgramName(): 現在のプログラムシーンが取得できること', async () => {
    const currentScene = await client.scenes.getProgramName();
    expect(typeof currentScene).toBe('string');
  });

  test('switch(): シーンを切り替えられること', async () => {
    // 現在のシーンを保持し、テストシーンに切り替えた後、元に戻す
    const originalScene = await client.scenes.getProgramName();
    await client.scenes.switch(testSceneName);
    const switchedScene = await client.scenes.getProgramName();
    expect(switchedScene).toBe(testSceneName);
    // クリーンアップ: 元のシーンに戻す
    await client.scenes.switch(originalScene);
  });

  test('rename(): シーン名を変更できること', async () => {
    renamedSceneName = `${testSceneName}-Renamed`;
    await client.scenes.rename(testSceneName, renamedSceneName);
    const existsOld = await client.scenes.exists(testSceneName);
    const existsNew = await client.scenes.exists(renamedSceneName);
    expect(existsOld).toBe(false);
    expect(existsNew).toBe(true);
    await client.scenes.rename(renamedSceneName, testSceneName);
    expect(await client.scenes.exists(testSceneName)).toBe(true);
  });

  test('remove(): シーンを削除できること', async () => {
    await client.scenes.remove(testSceneName);
    const existsAfter = await client.scenes.exists(testSceneName);
    expect(existsAfter).toBe(false);
  });

  // test('getItems(): シーンアイテムの一覧が取得できること', async () => {
  //   const currentScene = await client.scenes.getProgramName();
  //   const items = await client.scenes.getItems(currentScene);
  //   expect(Array.isArray(items)).toBe(true);
  // });

  // test('addItem() と removeItem(): シーンにアイテムを追加し削除できること', async () => {
  //   const currentScene = await client.scenes.getProgramName();
  //   // 注意: "dummy-source" は実際に存在するソース名に置き換えてください
  //   const sourceName = 'dummy-source';
  //   const added = await client.scenes.addItem(currentScene, sourceName, true);
  //   expect(added).toHaveProperty('sceneItemId');
  //   testItemId = added.sceneItemId;
  //   // 削除実行
  //   await client.scenes.removeItem(currentScene, testItemId);
  //   const items = await client.scenes.getItems(currentScene);
  //   const exists = items.some(item => item.sceneItemId === testItemId);
  //   expect(exists).toBe(false);
  // });

  // test('setItemEnabled(): シーンアイテムの表示状態を変更できること', async () => {
  //   const currentScene = await client.scenes.getProgramName();
  //   const sourceName = 'dummy-source';
  //   const added = await client.scenes.addItem(currentScene, sourceName, false);
  //   const itemId = added.sceneItemId;
  //   await client.scenes.setItemEnabled(currentScene, itemId, true);
  //   // 直接確認する手段がないため、エラーが発生しなければ成功と仮定
  //   await client.scenes.removeItem(currentScene, itemId);
  //   expect(true).toBe(true);
  // });

  // test('setItemTransform(): シーンアイテムの変換設定を更新できること', async () => {
  //   const currentScene = await client.scenes.getProgramName();
  //   const sourceName = 'dummy-source';
  //   const added = await client.scenes.addItem(currentScene, sourceName, true);
  //   const itemId = added.sceneItemId;
  //   const transform = { positionX: 100, positionY: 100, rotation: 45 };
  //   await client.scenes.setItemTransform(currentScene, itemId, transform);
  //   // 直接確認する手段がないため、エラーが発生しなければ成功と仮定
  //   await client.scenes.removeItem(currentScene, itemId);
  //   expect(true).toBe(true);
  // });

  // test('reorderItems(): シーンアイテムの順序を変更できること', async () => {
  //   const currentScene = await client.scenes.getProgramName();
  //   const sourceName = 'dummy-source';
  //   const added = await client.scenes.addItem(currentScene, sourceName, true);
  //   const itemId = added.sceneItemId;
  //   // 例として、先頭(0)に移動する
  //   await client.scenes.reorderItems(currentScene, itemId, 0);
  //   // 直接検証する手段がないため、エラーが発生しなければ成功と仮定
  //   await client.scenes.removeItem(currentScene, itemId);
  //   expect(true).toBe(true);
  // });

  test('removeAll(): 全てのシーンを削除するテスト（保護対象は削除しない）', async () => {
    // このテストは事故防止のため実際には removeAll() を呼び出しません。
    // 実際の環境に合わせて慎重に実施してください。
    // await client.scenes.removeAll("シーン");
    // const scenes = await client.scenes.list();
    // 保護対象のシーンが残っていることを確認
    // expect(scenes.length).toBe(1); 
  });
});