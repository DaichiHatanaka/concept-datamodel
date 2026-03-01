# プロジェクト概要

Tauri v2 + React 19 + Vite 6 のデスクトップアプリ開発テンプレート。
Claude Code による AI 駆動開発を前提とした設計。

## 技術スタック

| カテゴリ             | 技術                      | バージョン |
| -------------------- | ------------------------- | ---------- |
| デスクトップ         | Tauri                     | v2         |
| バックエンド言語     | Rust                      | stable     |
| DB                   | SQLite (rusqlite bundled) | 0.32       |
| フレームワーク       | React                     | 19         |
| ビルドツール         | Vite                      | 6          |
| 状態管理             | Zustand                   | v5         |
| スタイリング         | Tailwind CSS              | v4         |
| UIコンポーネント     | shadcn/ui                 | latest     |
| コマンドパレット     | cmdk                      | 1          |
| 言語                 | TypeScript                | 5 (strict) |
| パッケージマネージャ | pnpm                      | latest     |

## 主要コマンド

```bash
# 開発
pnpm tauri dev          # デスクトップアプリ起動 (Rust + Vite hot reload)
pnpm dev               # フロントエンドのみ起動 (http://localhost:1420)

# ビルド
pnpm tauri build        # プロダクションビルド + インストーラー生成
pnpm build             # フロントエンドのみビルド

# 品質チェック
pnpm lint              # ESLint チェック
pnpm type-check        # TypeScript 型チェック
pnpm test              # Vitest ユニットテスト

# Rust
cd src-tauri && cargo check   # Rust コンパイルチェック
cd src-tauri && cargo clippy  # Rust Lint
cd src-tauri && cargo test    # Rust テスト
cd src-tauri && cargo fmt     # Rust フォーマット
```

## ディレクトリ構造

```text
├── src/                       # React フロントエンド
│   ├── app/App.tsx            # メインレイアウト
│   ├── components/
│   │   ├── ui/                # shadcn/ui コンポーネント
│   │   ├── panels/            # サイドパネル
│   │   └── command-palette/   # コマンドパレット (⌘K)
│   ├── stores/                # Zustand ストア
│   │   ├── project-store.ts   # プロジェクト管理
│   │   └── ui-store.ts        # UI状態 (サイドバー、パレット)
│   ├── lib/
│   │   ├── tauri.ts           # 型付き Tauri IPC ブリッジ
│   │   └── utils.ts           # cn() ユーティリティ
│   └── types/                 # TypeScript 型定義
├── src-tauri/                 # Rust バックエンド
│   ├── src/
│   │   ├── lib.rs             # Tauri アプリビルダー
│   │   ├── commands/          # IPC コマンド
│   │   ├── db/                # SQLite (connection, models)
│   │   └── error.rs           # AppError 型
│   ├── migrations/            # SQL マイグレーション
│   ├── Cargo.toml
│   └── tauri.conf.json
└── tests/                     # フロントエンドテスト (Vitest)
```

## コーディング規約

### フロントエンド

- コンポーネントは機能ドメイン別ディレクトリに配置 (`panels/`, `dialogs/` 等)
- shadcn/ui コンポーネントは `src/components/ui/` に配置 (手動編集しない)
- スタイルは Tailwind CSS のユーティリティクラス + `cn()` で条件付き結合
- 状態管理は Zustand で一元管理。React state はコンポーネントローカルな UI 状態のみ
- Tauri IPC 呼び出しは必ず `src/lib/tauri.ts` を経由する

```typescript
// ✅ 正しい: tauri.ts 経由で IPC 呼び出し
import { createProject } from "@/lib/tauri";
const project = await createProject(name);

// ❌ 誤り: invoke を直接使わない
import { invoke } from "@tauri-apps/api/core";
const project = await invoke("create_project", { ... });
```

### Rust バックエンド

- IPC コマンドは `src-tauri/src/commands/` に機能別に分割
- エラーは `AppError` 型に統一。`thiserror` で定義
- SQLite は 1 接続 + `Mutex<Database>` で排他制御
- UUID は `uuid::Uuid::new_v4().to_string()` で生成

```rust
// ✅ 正しい: AppState 経由で DB アクセス
#[tauri::command]
pub fn create_project(state: State<AppState>, ...) -> Result<Project, AppError> {
    let db = state.db.lock().unwrap();
    // ...
}
```

### Tailwind v4 の注意点

- CSS 変数は `:root` と `.dark` に直接定義 (`@layer base` の外)
- `@theme inline` で全変数を Tailwind ユーティリティにマッピング
- `hsl()` ラッパーは `:root`/`.dark` 内のみ。`@layer base` では `var()` をそのまま使う
- `tailwind.config.ts` は不要 (v4 では `@tailwindcss/vite` プラグインを使用)

## MCP サーバー設定

`.mcp.json` にプロジェクト固有の MCP サーバーを定義している。

| MCP        | 用途                             |
| ---------- | -------------------------------- |
| context7   | ライブラリの最新ドキュメント参照 |
| playwright | E2E テスト・ブラウザ確認         |
| github     | PR/Issue 管理・ブランチ操作      |

## Workflow Orchestration

### 1. Plan Node Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy

- Use subagents to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents

### 3. Verification Before Done

- Never mark a task complete without proving it works
- Run `cargo check` after any Rust changes
- Run `pnpm type-check` after any TypeScript changes

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary.
