# OBS WebSocket シーン作成サンプル

このプロジェクトは、obs-websocket-jsを使用してOBSのシーンを作成するサンプルコードです。

## 前提条件

- Node.js がインストールされていること
- OBS Studio 28.0.0以降がインストールされていること
- OBS StudioでWebSocketサーバーが有効になっていること

## セットアップ

1. 依存関係をインストール:
```bash
npm install
```

2. OBS Studioの設定:
- ツール → WebSocket Server Settings を開く
- "Enable WebSocket Server" にチェックを入れる
- 必要に応じてServer PortとPasswordを設定（デフォルトは4455）

## 実行方法

```bash
npm start
```

## 機能

このサンプルコードは以下の機能を実装しています：

- OBS WebSocketへの接続
- 新しいシーンの作成
- ディスプレイキャプチャーソースの追加
- テキストソースの追加
- 作成したシーンをプログラムシーンとして設定

## 注意事項

- コードを実行する前に、OBS Studioが起動していることを確認してください
- WebSocketサーバーの設定（ポート番号やパスワード）が必要な場合は、index.jsの接続設定を適切に変更してください