# Tauri + React + TypeScript テンプレート

Tauri v2 + React 19 + Vite 6 のデスクトップアプリ開発テンプレート。
Claude Code による AI 駆動開発に最適化。

## 技術スタック

| カテゴリ             | 技術                      | バージョン |
| -------------------- | ------------------------- | ---------- |
| デスクトップ         | Tauri                     | v2         |
| バックエンド         | Rust (stable)             | -          |
| DB                   | SQLite (rusqlite bundled) | 0.32       |
| フロントエンド       | React                     | 19         |
| ビルド               | Vite                      | 6          |
| 状態管理             | Zustand                   | v5         |
| スタイリング         | Tailwind CSS v4           | v4         |
| UI コンポーネント    | shadcn/ui                 | latest     |
| コマンドパレット     | cmdk                      | 1          |
| 言語                 | TypeScript (strict)       | 5          |
| パッケージマネージャ | pnpm                      | latest     |

## セットアップ

### 前提条件

- [Node.js](https://nodejs.org/) v22+
- [pnpm](https://pnpm.io/)
- [Rust](https://rustup.rs/) stable
- Tauri v2 のシステム依存 ([公式ドキュメント](https://tauri.app/start/prerequisites/))

### インストール

```bash
git clone <your-repo-url>
cd <your-repo>
pnpm install
```

### 開発サーバー起動

```bash
pnpm tauri dev
```

初回は Rust のコンパイルに数分かかります。2 回目以降は差分ビルドで高速です。

## コマンド一覧

```bash
# 開発
pnpm tauri dev          # デスクトップアプリ起動 (Rust + Vite hot reload)
pnpm dev                # フロントエンドのみ起動 (http://localhost:1420)

# ビルド
pnpm tauri build        # プロダクションビルド + インストーラー生成
pnpm build              # フロントエンドのみビルド

# 品質チェック
pnpm lint               # ESLint チェック
pnpm type-check         # TypeScript 型チェック
pnpm test               # Vitest ユニットテスト

# Rust
cd src-tauri && cargo check    # Rust コンパイルチェック
cd src-tauri && cargo clippy   # Rust Lint
cd src-tauri && cargo test     # Rust テスト
cd src-tauri && cargo fmt      # Rust フォーマット
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
│   │   └── ui-store.ts        # UI 状態
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

## 含まれているもの

- **プロジェクト CRUD** — SQLite に保存する基本的な CRUD の参考実装
- **サイドバー + コマンドパレット** — Zustand で管理する UI パターン
- **shadcn/ui** — Button, Input, Dialog, Tooltip 等の基本コンポーネント
- **CI/CD** — GitHub Actions (lint/test/build + クロスプラットフォームビルド + リリース)
- **コード品質** — ESLint, Prettier, Husky + lint-staged, EditorConfig

## Windows での注意事項

VS 2022 Community の MSVC でビルドエラーが出る場合は `src-tauri/.cargo/config.toml` を作成してリンカーパスを設定してください。このファイルはマシン固有のため `.gitignore` に含まれています。

## GitHub Actions

3 つのワークフローが含まれています:

| ワークフロー  | トリガー        | 内容                                                             |
| ------------- | --------------- | ---------------------------------------------------------------- |
| `ci.yml`      | push / PR       | Frontend (lint + type-check + test) + Rust (fmt + clippy + test) |
| `build.yml`   | push / PR       | Tauri クロスプラットフォームビルド (Linux, Windows, macOS)       |
| `preview.yml` | タグ push (v\*) | GitHub Releases にインストーラーをアップロード                   |

## ライセンス

MIT — [LICENSE](LICENSE) を参照。
