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
    await this.removeAllScenes();
    await setTimeout(() => {}, 1000);
  }

  /**
   * すべてのソースを削除
   */
  async removeAllInputs() {
    try {
      const { inputs } = await this.obs.call('GetInputList');
      Logger.debug('ソース一覧:', inputs.map(input => input.inputName) || "none");
      for (const input of inputs) {
        await this.obs.call('RemoveInput', {
          inputName: input.inputName
        });
      }
    } catch (error) {
      Logger.error('ソース削除エラー:' + error);
      throw error;
    }
  }

  /**
   * ソースを削除
   * @param {string} inputName ソース名
   * @returns {Promise<void>}
   * @throws {Error} ソース削除エラー
   * @example
   * await cleaner.removeInput('ソース名');
   */
  async removeInput(inputName) {
    try {
      await this.obs.call('RemoveInput', {
        inputName: inputName
      });
      Logger.debug(`ソース "${inputName}" を削除しました`);
    } catch (error) {
      Logger.error('ソース削除エラー:' + error);
      throw error;
    }
  }



  /**
   * すべてのシーンを削除
   */
  async removeAllScenes() {
    try {
      const { scenes } = await this.obs.call('GetSceneList');
      Logger.debug('シーン一覧:', scenes.map(scene => scene.sceneName)|| "none");
      for (const scene of scenes) {
        await this.obs.call('RemoveScene', {
          sceneName: scene.sceneName
        });
      }
    } catch (error) {
      Logger.error('シーン削除エラー:' + error);
      throw error;
    }
  }

  /**
   * すべてのシーンコレクションを削除
   */
  async removeScene(sceneName) {
    try {
      await this.obs.call('RemoveScene', {
        sceneName: sceneName
      });
      Logger.debug(`シーン "${sceneName}" を削除しました`);
    } catch (error) {
      Logger.error('シーン削除エラー:' + error);
      throw error;
    }
  }
}