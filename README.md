## Linux Reader とは？
Linux Reader とは、LLMと一緒にLinuxのコードを読むためのツールです。

[\[LinuxReaderデモ\](https://youtu.be/jT_mHFuKsdQ)](https://youtu.be/jT_mHFuKsdQ)

#### [できること]
- 人がコードを読まずともLLMが関数探索してくれる
- 前に進んだ関数経路に戻れる
- 調べている関数経路のバグをLLMが見つけてくれる
- 調べている関数をLLMが図にしてくれる
- 調べた関数経路をLLMがレポートにしてくれる

#### [効果]
- Linuxコードをランダムウォークなしに読み進められる
- 土地勘がないと10分以上かかる数百行、数千行の関数のコードリーディングを、LLMが1分で終わらせてくれる
- Linuxコードのバグを見つけられる機能がある
- 頭にいれるだけで暗黙知になりがちな関数経路や関数の説明をLLMがしてくれる

#### [できないこと/人の作業]
- エントリーポイントの把握
- LLMによる関数自動探索（人が判断した方が正確）
- コードベースを分割せず一括でLLMに調べさせること

## 利用方法
VSCode拡張としてはまだ公開していません。  
公開し次第、VSCode拡張でのインストール方法を書きます。

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
しばらくすると、LLMが関数の中から重要な関数を選ぶので、そこから内容を探索したい関数を選択します。  
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