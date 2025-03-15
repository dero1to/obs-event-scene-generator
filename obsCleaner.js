import { Logger } from './logger.js';

export class ObsCleaner {
  constructor(obs) {
    this.obs = obs;
  }

  /**
   * すべてのソースとシーンを削除
   */
  async cleanAll() {
    await this.removeAllInputs();
    await this.removeScene('サンプルシーン');
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
        Logger.debug(`ソース "${input.inputName}" を削除しました`);
      }
    } catch (error) {
      Logger.error('ソース削除エラー:' + error);
      throw error;
    }
  }

  /**
   * 指定されたシーンを削除
   */
  async removeScene(sceneName) {
    try {
      await this.obs.call('RemoveScene', {
        sceneName: sceneName
      });
      Logger.debug(`シーン "${sceneName}" を削除しました`);
    } catch (error) {
      // シーンが存在しない場合は無視
      if (!error.message.includes('not found')) {
        throw error;
      }
    }
  }
}