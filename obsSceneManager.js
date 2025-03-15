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
    console.log(`シーン "${sceneName}" をプログラムに設定しました`);
  }

  /**
   * プレビューシーンとして設定
   */
  async setPreviewScene(sceneName) {
    await this.obs.call('SetCurrentPreviewScene', {
      sceneName: sceneName
    });
    console.log(`シーン "${sceneName}" をプレビューに設定しました`);
  }

  /**
   * スタジオモードを有効/無効にする
   */
  async setStudioMode(enabled) {
    await this.obs.call('SetStudioModeEnabled', {
      studioModeEnabled: enabled
    });
    console.log(`スタジオモードを${enabled ? '有効' : '無効'}にしました`);
  }
}