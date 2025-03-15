import { BaseModule } from './base.js';

export class OutputModule extends BaseModule {
  /**
   * ストリーミングの開始
   * @returns {Promise<void>}
   */
  async startStream() {
    await this._call('StartStream');
  }

  /**
   * ストリーミングの停止
   * @returns {Promise<void>}
   */
  async stopStream() {
    await this._call('StopStream');
  }

  /**
   * 録画の開始
   * @returns {Promise<void>}
   */
  async startRecording() {
    await this._call('StartRecord');
  }

  /**
   * 録画の停止
   * @returns {Promise<string>} 録画ファイルのパス
   */
  async stopRecording() {
    const { outputPath } = await this._call('StopRecord');
    return outputPath;
  }

  /**
   * 録画の一時停止
   * @returns {Promise<void>}
   */
  async pauseRecording() {
    await this._call('PauseRecord');
  }

  /**
   * 録画の再開
   * @returns {Promise<void>}
   */
  async resumeRecording() {
    await this._call('ResumeRecord');
  }

  /**
   * 仮想カメラの開始
   * @returns {Promise<void>}
   */
  async startVirtualCam() {
    await this._call('StartVirtualCam');
  }

  /**
   * 仮想カメラの停止
   * @returns {Promise<void>}
   */
  async stopVirtualCam() {
    await this._call('StopVirtualCam');
  }

  /**
   * リプレイバッファの開始
   * @returns {Promise<void>}
   */
  async startReplayBuffer() {
    await this._call('StartReplayBuffer');
  }

  /**
   * リプレイバッファの停止
   * @returns {Promise<void>}
   */
  async stopReplayBuffer() {
    await this._call('StopReplayBuffer');
  }

  /**
   * リプレイバッファの保存
   * @returns {Promise<string>} 保存されたファイルのパス
   */
  async saveReplayBuffer() {
    const { outputPath } = await this._call('SaveReplayBuffer');
    return outputPath;
  }

  /**
   * 出力の統計情報を取得
   * @returns {Promise<Object>} 統計情報
   */
  async getStats() {
    return await this._call('GetStats');
  }

  /**
   * ストリーム設定を取得
   * @returns {Promise<Object>} ストリーム設定
   */
  async getStreamSettings() {
    return await this._call('GetStreamServiceSettings');
  }

  /**
   * ストリーム設定を更新
   * @param {string} streamType ストリームタイプ
   * @param {Object} settings ストリーム設定
   * @returns {Promise<void>}
   */
  async setStreamSettings(streamType, settings) {
    await this._call('SetStreamServiceSettings', {
      streamServiceType: streamType,
      streamServiceSettings: settings
    });
  }

  /**
   * 出力ステータスを取得
   * @returns {Promise<Object>} 出力ステータス
   */
  async getStatus() {
    return await this._call('GetOutputStatus');
  }

  /**
   * 出力設定を取得
   * @returns {Promise<Object>} 出力設定
   */
  async getSettings() {
    return await this._call('GetOutputSettings');
  }

  /**
   * 出力設定を更新
   * @param {string} outputType 出力タイプ
   * @param {Object} settings 出力設定
   * @returns {Promise<void>}
   */
  async setSettings(outputType, settings) {
    await this._call('SetOutputSettings', {
      outputType,
      outputSettings: settings
    });
  }
}