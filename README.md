# Ultimate TODO Application

A sophisticated TODO application built with Next.js, React, TypeScript, and Prisma.

## Features

- Task management with categories and tags
- Priority levels and due dates
- Filtering and sorting capabilities
- Responsive design with dark/light mode
- Data persistence with SQLite and Prisma ORM

## Tech Stack

- Next.js 15.1.3
- React 19.0.0
- TypeScript 5.0.0
- Tailwind CSS 3.4.17
- shadcn/ui 2.1.8
- Prisma 5.0.0
- SQLite 3.0.0

## Project Structure

```
my-next-app/
├── app/
│   ├── api/                 # APIエンドポイント
│   ├── components/          # コンポーネント
│   │   ├── ui/             # 基本UI要素
│   │   └── layout/         # レイアウト
│   ├── hooks/              # カスタムフック
│   ├── lib/                # ユーティリティ
│   │   ├── api/           # API関連
│   │   └── utils/         # 共通関数
│   └── styles/            # スタイル定義
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Initialize the database: `npm run prisma:migrate`
4. Start the development server: `npm run dev`
