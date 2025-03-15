/**
 * モジュールの基底クラス
 */
export class BaseModule {
  /**
   * @param {import('../client').OBSClient} client OBSクライアントインスタンス
   */
  constructor(client) {
    this._client = client;
  }

  /**
   * WebSocketメソッドを呼び出し
   * @protected
   * @param {string} method メソッド名
   * @param {Object} [args={}] 引数
   * @returns {Promise<any>}
   */
  _call(method, args = {}) {
    return this._client.call(method, args);
  }

  /**
   * イベントリスナーを登録
   * @protected
   * @param {string} event イベント名
   * @param {Function} callback コールバック関数
   */
  _on(event, callback) {
    this._client.on(event, callback);
  }

  /**
   * イベントリスナーを削除
   * @protected
   * @param {string} event イベント名
   * @param {Function} callback コールバック関数
   */
  _off(event, callback) {
    this._client.off(event, callback);
  }
}