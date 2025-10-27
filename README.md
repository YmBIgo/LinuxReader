## Linux Reader とは？
Linux Reader とは、LLMと一緒にLinuxのコードを読むためのツールです。

[\[LinuxReaderデモ\](https://youtu.be/jT_mHFuKsdQ)](https://youtu.be/jT_mHFuKsdQ)

:::note alert
BuiltinでないC/C++のVSCode拡張とは共存できません。
Linux Readerを使うときは、BuiltinでないC/C++のVSCode拡張はdisableにしてください。
:::

#### [できること]
- 人がコードを読まずともLLMが関数探索してくれる
- 前に進んだ関数経路に戻れる
- 調べている関数経路のバグをLLMが見つけてくれる
- 調べている関数をLLMが図にしてくれる
- 調べた関数経路をLLMがレポートにしてくれる
- 調べた関数経路をJSONで保存・再現できる

#### [効果]
- Linuxコードをランダムウォークなしに読み進められる
- 土地勘がないと10分以上かかる数百行、数千行の関数のコードリーディングを、LLMが1分で終わらせてくれる
- Linuxコードのバグを見つけられる機能がある
- 頭にいれるだけで暗黙知になりがちな関数経路や関数の説明をLLMがしてくれる
- 従来は頭にしか入っていなかったコードという暗黙知が形式知にできる

#### [できないこと/人の作業]
- エントリーポイントの把握
- LLMによる関数自動探索（人が判断した方が正確）
- コードベースを分割せず一括でLLMに調べさせること

#### 用意するもの
clangd(14系以上), Linuxのコード, Linuxのcompile_commands.json, vscode(1.100.0以上)  
OpenAIかAnthropicかPLaMoのAPIキー

1. Linuxコードベース、clangdの準備

```
git clone https://github.com/torvalds/linux
brew install clangd
```

2. compile_commands.json の用意

https://zenn.dev/tmsn/articles/6317bdf591bc97

なども参考にする

```
make defconfig
bear -- make LLVM=1 -j16
```

3. vscode のインストール

1.100.0 以上をインストールしてください

4. VSCode で LinuxReader をダウンロード

https://marketplace.visualstudio.com/items?itemName=coffeecupjapan.linux-reader&ssr=false#overview

#### 開く
ダウンロード完了したら、「Command + Shift + p」でコマンドパレットを開き、「Open Linux in New Tab」をクリック  
クリック後に、右側にタブウィンドウが出てくれば成功です

5. 設定の入力
clangdのパス、Linuxのパス、compile_commands.json のディレクトリのパス、LLM（OpenAI・Claude・Plamo）を入力

6. チャット画面で探索を開始
最初に、「探索を開始するファイルパス」「探索を開始する関数」「探索の目的」を入力すれば、探索を開始できます。

7. 探索を制御
しばらくすると、LLMが関数のステップを説明したのちに、関数の中から重要な関数を選ぶので、そこから内容を探索したい関数を選択します。  
すると、またLLMが関数の中から重要な関数を選ぶので、そこから再度探索したい関数を選択します。  
以上の流れを、自分がいいと思うまで続けます。

## Release Notes

#### 1.0.0

LinuxReaderの最初のリリース

#### 1.0.2

履歴保存・履歴から再検索の機能を追加

### 1.0.3

Gemini対応

### 1.0.4

jump機能追加

### 1.0.5

履歴入力時に、対話的にコードジャンプする機能追加

### 1.0.6

セキュリティアップデート

### 1.0.7

バグ修正と単体テストの導入

### 1.0.8

History検索関連のバグ修正とHistoryでの単体テストの導入

### 1.0.9

レポート出力の修正とモデルの追加

### 1.0.10

「->」対応のバグと改行含みの関数の位置取得のバグ修正

### 1.0.11

概念ステップ説明を実装
