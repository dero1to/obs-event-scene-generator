export class ObsSceneCreator {
  constructor(obs) {
    this.obs = obs;
  }

  /**
   * サンプルシーンを作成し、ソースを追加
   */
  async createSampleScene() {
    try {
      const sceneName = 'サンプルシーン';
      
      // シーンの作成
      await this.createScene(sceneName);
      
      // ディスプレイキャプチャーを追加
      await this.addDisplayCapture(sceneName);
      
      // テキストソースを追加
      await this.addTextSource(sceneName);
    } catch (error) {
      throw error;
    }
  }

  /**
   * シーンを作成
   */
  async createScene(sceneName) {
    try {
      await this.obs.call('CreateScene', {
        sceneName: sceneName
      });
      console.log(`シーンを作成しました: ${sceneName}`);
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`シーン "${sceneName}" は既に存在します`);
        return;
      }
      throw error;
    }
  }

  /**
   * ディスプレイキャプチャーを追加
   */
  async addDisplayCapture(sceneName) {
    const displayCaptureName = 'ディスプレイキャプチャー';
    
    try {
      await this.obs.call('CreateInput', {
        sceneName: sceneName,
        inputName: displayCaptureName,
        inputKind: 'display_capture'
      });
      console.log('ディスプレイキャプチャーを追加しました');

      // サイズと位置を調整
      const { sceneItemId } = await this.obs.call('GetSceneItemId', {
        sceneName: sceneName,
        sourceName: displayCaptureName
      });

      await this.obs.call('SetSceneItemTransform', {
        sceneName: sceneName,
        sceneItemId: sceneItemId,
        sceneItemTransform: {
          boundsAlignment: 0,
          boundsHeight: 1080,
          boundsType: 'OBS_BOUNDS_STRETCH',
          boundsWidth: 1920,
          positionX: 0,
          positionY: 0,
          rotation: 0,
          scaleX: 1,
          scaleY: 1
        }
      });
      console.log('ディスプレイキャプチャーのサイズと位置を調整しました');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`ソース "${displayCaptureName}" は既に存在します`);
        return;
      }
      throw error;
    }
  }

  /**
   * テキストソースを追加
   */
  async addTextSource(sceneName) {
    const textSourceName = 'サンプルテキスト';
    
    try {
      await this.obs.call('CreateInput', {
        sceneName: sceneName,
        inputName: textSourceName,
        inputKind: 'text_ft2_source_v2',
        inputSettings: {
          text: 'こんにちは、OBS WebSocket!',
          font: {
            face: 'Arial',
            size: 36
          }
        }
      });
      console.log('テキストソースを追加しました');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`ソース "${textSourceName}" は既に存在します`);
        return;
      }
      throw error;
    }
  }
}