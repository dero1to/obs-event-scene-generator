import { BaseModule } from './base.js';

export class InputModule extends BaseModule {
  /**
   * 利用可能な入力種類のリストを取得
   * @returns {Promise<Array<Object>>} 入力種類のリスト
   */
  async getInputKinds() {
    const { inputKinds } = await this._call('GetInputKindList');
    return inputKinds;
  }

  /**
   * 入力ソースのリストを取得
   * @param {string} [inputKind] 特定の入力種類でフィルタ（省略可）
   * @returns {Promise<Array<Object>>} 入力ソースのリスト
   */
  async list(inputKind = null) {
    const { inputs } = await this._call('GetInputList', 
      inputKind ? { inputKind } : {}
    );
    return inputs;
  }

  /**
   * 新しい入力ソースを作成
   * @param {string} inputName 入力ソース名
   * @param {string} inputKind 入力種類
   * @param {Object} [settings={}] 入力設定
   * @returns {Promise<void>}
   */
  async create(inputName, inputKind, settings = {}) {
    await this._call('CreateInput', {
      inputName,
      inputKind,
      inputSettings: settings
    });
  }

  /**
   * 入力ソースを削除
   * @param {string} inputName 入力ソース名
   * @returns {Promise<void>}
   */
  async remove(inputName) {
    await this._call('RemoveInput', {
      inputName
    });
  }

  /**
   * すべての入力ソースを削除
   * @returns {Promise<void>}
   */
  async removeAll() {
    const { inputs } = await this.list();
    for (const input of inputs) {
      await this.remove(input.inputName);
    }
  }

  /**
   * 入力ソースの設定を取得
   * @param {string} inputName 入力ソース名
   * @returns {Promise<Object>} 入力設定
   */
  async getSettings(inputName) {
    const { inputSettings } = await this._call('GetInputSettings', {
      inputName
    });
    return inputSettings;
  }

  /**
   * 入力ソースの設定を更新
   * @param {string} inputName 入力ソース名
   * @param {Object} settings 新しい設定
   * @returns {Promise<void>}
   */
  async setSettings(inputName, settings) {
    await this._call('SetInputSettings', {
      inputName,
      inputSettings: settings
    });
  }

  /**
   * 入力ソースのミュート状態を設定
   * @param {string} inputName 入力ソース名
   * @param {boolean} muted ミュート状態
   * @returns {Promise<void>}
   */
  async setMuted(inputName, muted) {
    await this._call('SetInputMute', {
      inputName,
      inputMuted: muted
    });
  }

  /**
   * 入力ソースのボリュームを設定（0.0-1.0）
   * @param {string} inputName 入力ソース名
   * @param {number} volume ボリューム（0.0-1.0）
   * @returns {Promise<void>}
   */
  async setVolume(inputName, volume) {
    await this._call('SetInputVolume', {
      inputName,
      inputVolumeMul: volume
    });
  }

  /**
   * 入力ソースの音声モニター設定を更新
   * @param {string} inputName 入力ソース名
   * @param {string} monitorType モニタータイプ ('none' | 'monitorOnly' | 'monitorAndOutput')
   * @returns {Promise<void>}
   */
  async setAudioMonitor(inputName, monitorType) {
    await this._call('SetInputAudioMonitorType', {
      inputName,
      monitorType
    });
  }

  /**
   * メディア入力の再生状態を制御
   * @param {string} inputName 入力ソース名
   * @param {string} mediaAction アクション ('play' | 'pause' | 'restart' | 'stop')
   * @returns {Promise<void>}
   */
  async controlMedia(inputName, mediaAction) {
    await this._call('TriggerMediaInputAction', {
      inputName,
      mediaAction
    });
  }

  /**
   * ブラウザソースのURLを更新
   * @param {string} inputName 入力ソース名
   * @param {string} url 新しいURL
   * @returns {Promise<void>}
   */
  async setBrowserURL(inputName, url) {
    const settings = await this.getSettings(inputName);
    settings.url = url;
    await this.setSettings(inputName, settings);
  }

  /**
   * ブラウザソースをリフレッシュ
   * @param {string} inputName 入力ソース名
   * @returns {Promise<void>}
   */
  async refreshBrowser(inputName) {
    await this._call('PressInputPropertiesButton', {
      inputName,
      propertyName: 'refreshnocache'
    });
  }
}