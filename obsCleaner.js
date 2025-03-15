export class ObsCleaner {
  constructor(obs) {
    this.obs = obs;
  }

  /**
   * すべてのソースとシーンを削除
   */
  async cleanAll() {
    await this.removeAllInputs();
    await this.removeAllScenes();
    // 削除処理が完了するまで待機
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * すべてのソースを削除
   */
  async removeAllInputs() {
    try {
      const { inputs } = await this.obs.call('GetInputList');
      for (const input of inputs) {
        await this.obs.call('RemoveInput', {
          inputName: input.inputName
        });
        console.log(`ソース "${input.inputName}" を削除しました`);
      }
    } catch (error) {
      console.error('ソース削除エラー:', error);
      throw error;
    }
  }

  /**
   * 指定されたシーンを削除
   */
  async removeAllScenes() {
    try {
        const { scenes } = await this.obs.call('GetSceneList');
        for (const scene of scenes) {
            await this.obs.call('RemoveScene', {
            sceneName: scene.sceneName
            });
            console.log(`シーン "${scene.sceneName}" を削除しました`);
        }
    } catch (error) {
      // シーンが存在しない場合は無視
      if (!error.message.includes('not found')) {
        throw error;
      }
    }
  }
}