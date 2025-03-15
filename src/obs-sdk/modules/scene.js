import { Logger } from '../../../logger.js';
import { BaseModule } from './base.js';

export class SceneModule extends BaseModule {
  /**
   * シーンリストを取得
   * @returns {Promise<Array<Object>>} シーンのリスト
   */
  async list() {
    const { scenes } = await this._call('GetSceneList');
    return scenes || [];
  }

  /**
   * 現在のプログラムシーンを取得
   * @returns {Promise<string>} 現在のシーン名
   */
  async getCurrentScene() {
    const { currentProgramSceneName } = await this._call('GetCurrentProgramScene');
    return currentProgramSceneName;
  }

  /**
   * シーンを切り替え
   * @param {string} sceneName シーン名
   * @returns {Promise<void>}
   */
  async switch(sceneName) {
    if (!await this.exists(sceneName)) {
      Logger.warn(`シーン "${sceneName}" は存在しません`);
      return;
    }
    await this._call('SetCurrentProgramScene', {
      sceneName
    });
    Logger.debug(`シーンを "${sceneName}" に切り替えました`);
  }

  /**
   * 新しいシーンを作成
   * @param {string} sceneName シーン名
   * @returns {Promise<void>}
   */
  async create(sceneName) {
    if (!await this.exists(sceneName)) {
      Logger.warn(`シーン "${sceneName}" は既に存在します`);
      return;
    }
    await this._call('CreateScene', {
      sceneName
    });
    Logger.debug(`シーン "${sceneName}" を作成しました`);
  }

  /**
   * シーンを削除
   * @param {string} sceneName シーン名
   * @returns {Promise<void>}
   */
  async remove(sceneName) {
    
    if (!(await this.exists(sceneName))) {
      Logger.warn(`シーン "${sceneName}" は存在しません`);
      return;
    }
    if( await this.list().length === 1 ) {
      Logger.warn('シーンが1つしかないため削除できません');
      return;
    }

    await this._call('RemoveScene', {
      sceneName
    });
    Logger.debug(`シーン "${sceneName}" を削除しました`);
  }

  /**
   * すべてのシーンを削除
   * @returns {Promise<void>}
   */
  async removeAll() {
    const scenes = await this.list();

    for (const scene of scenes) {
      await this.remove(scene.sceneName);
    }
  }

  /**
   * シーンが存在するか確認
   * @param {string} sceneName シーン名
   * @returns {Promise<boolean>} 存在する場合はtrue
   */
  async exists(sceneName) {
    const scenes = await this.list();
    return scenes.some(scene => scene.sceneName === sceneName);
  }

  /**
   * シーン名を変更
   * @param {string} oldSceneName 現在のシーン名
   * @param {string} newSceneName 新しいシーン名
   * @returns {Promise<void>}
   */
  async rename(oldSceneName, newSceneName) {
    if (!await this.exists(oldSceneName)) {
      Logger.warn(`シーン "${oldSceneName}" は存在しません`);
      return;
    }
    if (await this.exists(newSceneName)) {
      Logger.warn(`シーン "${newSceneName}" は既に存在します`);
      return;
    }
    await this._call('SetSceneName', {
      sceneName: oldSceneName,
      newSceneName
    });
    Logger.debug(`シーン "${oldSceneName}" を "${newSceneName}" に変更しました`);
  }

  /**
   * シーンのアイテムリストを取得
   * @param {string} sceneName シーン名
   * @returns {Promise<Array<Object>>} シーンアイテムのリスト
   */
  async getItems(sceneName) {
    if (!await this.exists(sceneName)) {
      Logger.warn(`シーン "${sceneName}" は存在しません`);
      return [];
    }
    const { sceneItems } = await this._call('GetSceneItemList', {
      sceneName
    });
    return sceneItems || [];
  }

  /**
   * シーンにアイテムを追加
   * @param {string} sceneName シーン名
   * @param {string} sourceName ソース名
   * @param {boolean} [enabled=true] 有効/無効
   * @returns {Promise<Object>} 作成されたシーンアイテムの情報
   */
  async addItem(sceneName, sourceName, enabled = true) {
    const { sceneItemId } = await this._call('CreateSceneItem', {
      sceneName,
      sourceName,
      sceneItemEnabled: enabled
    });
    Logger.debug(`シーン "${sceneName}" にソース "${sourceName}" を追加しました`);
    return { sceneItemId };
  }

  /**
   * シーンアイテムを削除
   * @param {string} sceneName シーン名
   * @param {number} sceneItemId シーンアイテムID
   * @returns {Promise<void>}
   */
  async removeItem(sceneName, sceneItemId) {
    if (!await this.exists(sceneName)) {
      Logger.warn(`シーン "${sceneName}" は存在しません`);
      return;
    }
    await this._call('RemoveSceneItem', {
      sceneName,
      sceneItemId
    });
    Logger.debug(`シーン "${sceneName}" のアイテム ${sceneItemId} を削除しました`);
  }

  /**
   * シーンアイテムの表示/非表示を設定
   * @param {string} sceneName シーン名
   * @param {number} sceneItemId シーンアイテムID
   * @param {boolean} enabled 表示/非表示
   * @returns {Promise<void>}
   */
  async setItemEnabled(sceneName, sceneItemId, enabled) {
    if (!await this.exists(sceneName)) {
      Logger.warn(`シーン "${sceneName}" は存在しません`);
      return;
    }

    await this._call('SetSceneItemEnabled', {
      sceneName,
      sceneItemId,
      sceneItemEnabled: enabled
    });

    Logger.debug(`シーン "${sceneName}" のアイテム ${sceneItemId} の表示を ${enabled ? '有効' : '無効'} にしました`);
  }

  /**
   * シーンアイテムの変換設定を更新
   * @param {string} sceneName シーン名
   * @param {number} sceneItemId シーンアイテムID
   * @param {Object} transform 変換設定
   * @returns {Promise<void>}
   */
  async setItemTransform(sceneName, sceneItemId, transform) {
    if (!await this.exists(sceneName)) {
      Logger.warn(`シーン "${sceneName}" は存在しません`);
      return;
    }
    
    await this._call('SetSceneItemTransform', {
      sceneName,
      sceneItemId,
      sceneItemTransform: transform
    });

    Logger.debug(`シーン "${sceneName}" のアイテム ${sceneItemId} の変換設定を更新しました`);
  }

  /**
   * シーンの順序を変更
   * @param {string} sceneName シーン名
   * @param {number} sceneItemId シーンアイテムID
   * @param {number} position 新しい位置（0ベース）
   * @returns {Promise<void>}
   */
  async reorderItems(sceneName, sceneItemId, position) {
    if (!await this.exists(sceneName)) {
      Logger.warn(`シーン "${sceneName}" は存在しません`);
      return;
    }
    if (position < 0) {
      Logger.warn('位置は0以上の整数で指定してください');
      return;
    }

    await this._call('SetSceneItemIndex', {
      sceneName,
      sceneItemId,
      sceneItemIndex: position
    });
    Logger.debug(`シーン "${sceneName}" のアイテム ${sceneItemId} の順序を ${position} に変更しました`);
  }
}