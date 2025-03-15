import { Logger } from './logger.js';

export class ObsSceneManager {
  constructor(obs) {
    this.obs = obs;
  }

  /**
   * プログラムシーンとして設定
   */
  async setProgramScene(sceneName) {
    await this.obs.call('SetCurrentProgramScene', {
      sceneName: sceneName
    });
    Logger.debug(`シーン "${sceneName}" をプログラムに設定しました`);
  }

  /**
   * プレビューシーンとして設定
   */
  async setPreviewScene(sceneName) {
    await this.obs.call('SetCurrentPreviewScene', {
      sceneName: sceneName
    });
    Logger.debug(`シーン "${sceneName}" をプレビューに設定しました`);
  }

  /**
   * スタジオモードを有効/無効にする
   */
  async setStudioMode(enabled) {
    await this.obs.call('SetStudioModeEnabled', {
      studioModeEnabled: enabled
    });
    Logger.debug(`スタジオモードを${enabled ? '有効' : '無効'}にしました`);
  }
}