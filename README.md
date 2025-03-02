# Ultimate TODO Application

A sophisticated TODO application built with Next.js, React, TypeScript, and Prisma.

## Features

- Task management with categories and tags
- Priority levels and due dates
- Filtering and sorting capabilities
- Responsive design with dark/light mode
- Data persistence with SQLite and Prisma ORM

## Tech Stack

- Next.js 14.0.4
- React 18.2.0
- TypeScript 5.0.0
- Tailwind CSS 3.4.17
- shadcn/ui components
- Prisma 5.0.0
- SQLite 3.0.0

## Project Structure

```
ultimate-todo-app/
├── app/
│   ├── api/                 # APIエンドポイント
│   ├── components/          # コンポーネント
│   │   ├── ui/             # 基本UI要素
│   │   ├── todo/           # ToDoアイテム関連
│   │   └── layout/         # レイアウト
│   ├── hooks/              # カスタムフック
│   ├── lib/                # ユーティリティ
│   │   ├── api/           # API関連
│   │   ├── services/      # サービス層
│   │   └── utils/         # 共通関数
│   └── providers.tsx       # Providers設定
```

## Getting Started

### 必要条件

- Node.js 20.x以上
- npm 10.x以上

### インストールと実行

1. リポジトリをクローン

```bash
git clone https://github.com/eidas/ultimate-todo-app.git
cd ultimate-todo-app
```

2. 依存関係のインストール

```bash
npm install --legacy-peer-deps
```

`--legacy-peer-deps` フラグを使用することで、依存関係の互換性警告を無視して強制的にインストールします。

3. Prismaの初期化

```bash
npx prisma generate
npx prisma migrate dev --name init
```

これにより、SQLiteデータベースが初期化され、テーブル構造が作成されます。マイグレーション名を聞かれた場合は、`init` などの名前を入力してください。

4. 開発サーバーの起動

```bash
npm run dev
```

5. ブラウザでアクセス

ブラウザで `http://localhost:3000` にアクセスすると、アプリケーションが表示されます。

### トラブルシューティング

インストールや実行時に問題が発生した場合は、以下を確認してください：

- **インストールエラー**: 依存関係の互換性問題がある場合は、`--legacy-peer-deps` または `--force` フラグを使用してください。
- **Prismaエラー**: スキーマが見つからないエラーが出る場合は、`prisma/schema.prisma` ファイルが存在することを確認してください。
- **実行時エラー**: ブラウザの開発者ツールのコンソールでエラーを確認し、対応する部分を修正してください。

## 使い方

アプリケーションでは以下の操作が可能です：

- タスクの追加、編集、削除、完了のマーク
- カテゴリとタグによるタスクの整理
- 優先度と期限の設定
- 様々な条件でのフィルタリングと検索
- ダークモード/ライトモードの切り替え
