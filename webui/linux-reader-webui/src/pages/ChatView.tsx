import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { Message } from "../type/Message";
import VscodeButton from "@vscode-elements/react-elements/dist/components/VscodeButton";
import VscodeTextfield from "@vscode-elements/react-elements/dist/components/VscodeTextfield";
import Mermaid from "../components/Mermaid";
import VscodeIcon from "@vscode-elements/react-elements/dist/components/VscodeIcon";
import { vscode } from "../utils/vscode";
import { VscodeProgressRing } from "@vscode-elements/react-elements";

type ChatViewType = {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setIsSettingPage: Dispatch<SetStateAction<boolean>>;
};

const INPUT_PHASE_NUMBER = [0, 1, 2];
const BACK_PHASE_NUMBER = [1, 2, 3];
const INPUT_PHASE_TEXT = [
  "「検索したいファイルパス」を入力してください",
  "次は「検索したい関数名の１行」を入力してください",
  "次は「目的」を入力してください",
  "タスクを開始する場合は、下の「タスクを開始する」ボタンを押してください",
];

const ChatView: React.FC<ChatViewType> = ({ messages, setMessages, setIsSettingPage }) => {
  const [inputPhase, setInputPhase] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [rootPath, setRootPath] = useState<string>("");
  const [rootFunctionName, setRootFunctionName] = useState("");
  const [purpose, setPurpose] = useState("");
  const task =
    rootPath && rootFunctionName && purpose
      ? `検索したいファイルパス : ${rootPath}
検索する関数の１行: ${rootFunctionName}
目的: ${purpose}`
      : "タスクは開始されていません";

  const lastMessage = messages[messages.length - 1];
  const [inputText, setInputText] = useState<string>("");
  const primaryButtonText =
    inputPhase === 0
      ? "検索したいファイルパスを入力"
      : inputPhase === 1
      ? "検索する関数の１行を入力"
      : inputPhase === 2
      ? "目的を入力"
      : inputPhase === 3
      ? "タスクを開始する"
      : inputPhase === 4
      ? "選択する"
      : inputPhase === 5
      ? "　"
      : "不明なコマンド";

  const secondaryButtonText =
    inputPhase === 0
      ? "　"
      : inputPhase === 1
      ? "戻る"
      : inputPhase === 2
      ? "戻る"
      : inputPhase === 3
      ? "戻る"
      : inputPhase === 4
      ? "キャンセルする"
      : inputPhase === 5
      ? "　"
      : "不明なコマンド";

  const handleSecondaryButtonClick = () => {
    if (BACK_PHASE_NUMBER.includes(inputPhase)) {
      if (inputPhase === 1) {
        setRootFunctionName("");
      } else if (inputPhase === 2) {
        setPurpose("");
      } else if (inputPhase === 3) {
        // skip
      }
      setMessages((m) => [
        ...m,
        {
          type: "say",
          content: INPUT_PHASE_TEXT[inputPhase - 1],
          time: Date.now() + 100,
        },
      ]);
      setInputText("");
      setInputPhase((i_phase) => (i_phase - 1) as 0 | 1 | 2);
    } else {
      return;
    }
  };

  const handlePrimaryButtonClick = () => {
    if (INPUT_PHASE_NUMBER.includes(inputPhase)) {
      if (inputPhase === 0) {
        setRootPath(inputText);
      } else if (inputPhase === 1) {
        setRootFunctionName(inputText);
      } else if (inputPhase === 2) {
        setPurpose(inputText);
      }
      setMessages((m) => [
        ...m,
        {
          type: "user",
          content: inputText,
          time: Date.now(),
        },
        {
          type: "say",
          content: INPUT_PHASE_TEXT[inputPhase + 1],
          time: Date.now() + 100,
        },
      ]);
      setInputText("");
      setInputPhase((ip) => {
        const newphase = ip + 1;
        if (newphase < 6 && newphase >= 0) return newphase as 0 | 1 | 2 | 3;
        return ip;
      });
    } else if (inputPhase === 3) {
      setMessages([]);
      vscode.postMessage({
        type: "Init",
        rootPath,
        rootFunctionName,
        purpose,
      });
      setInputPhase(4);
    } else if (inputPhase === 4) {
      if (!inputText.trim()) {
        return;
      }
      vscode.postMessage({
        type: "Ask",
        askResponse: inputText.trim(),
      });
      setInputPhase(5);
    }
  };

  useEffect(() => {
    if (!lastMessage) return;
    if (lastMessage.type === "ask") {
      setInputPhase(4);
      const messagesContainer = document.getElementById("messages");
      messagesContainer?.lastElementChild?.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
    }
  }, [lastMessage]);

  return (
    <div
      style={{
        width: "350px",
        height: "95vh",
        overflow: "scroll",
        position: "relative",
        borderRight: "1px solid black",
      }}
      id="container"
    >
      <div
        style={{
          border: "3px solid blue",
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "10px",
          width: "310px",
          margin: "10px 10px",
          position: "fixed",
          top: "0px",
          left: "10px",
          whiteSpace: "break-spaces",
          overflow: "scroll",
        }}
      >
        <p style={{ color: "black", margin: "0" }}>
          {task}
          <hr />
          まだ設定が完了していなかったら設定を完了させてください
          <br/>
          <VscodeButton onClick={() => setIsSettingPage(true)}>設定画面</VscodeButton>
          <br />
        </p>
      </div>
      <div
        id="messages"
        style={{
          width: "310px",
          padding: "10px",
          margin: "150px 0 50px",
          height: "calc(100vh - 320px)",
        }}
      >
        <div
          style={{
            padding: "10px",
            margin: "10px 0",
            height: "50px",
            width: "310px",
          }}
        ></div>
        {messages.map((message) =>
          message.type === "ask" || message.type === "say" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                backgroundColor: "white",
                padding: "10px",
                margin: "10px 0",
                whiteSpace: "break-spaces",
                width: "310px",
                color: "black",
                overflow: "scroll",
              }}
            >
              {message.content}
            </div>
          ) : message.type === "error" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                backgroundColor: "#dc3545",
                color: "white",
                padding: "10px",
                margin: "10px 0",
                whiteSpace: "break-spaces",
                width: "310px",
                overflow: "scroll",
              }}
            >
              Error Occurs... Please try again...
              <br />
              Reason : {message.content}
              <br />
              Please press "here" above to reset...
            </div>
          ) : message.type === "mermaid" ? (
            <div
              style={{
                padding: "10px",
                margin: "10px 0",
                width: "310px",
                overflow: "scroll",
              }}
            >
              <Mermaid code={message.content} />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                backgroundColor: "#4cc764",
                color: "white",
                padding: "10px",
                margin: "10px 0",
                whiteSpace: "break-spaces",
                width: "310px",
                overflow: "scroll",
              }}
            >
              {message.content}
            </div>
          )
        )}
        {inputPhase === 5 || messages.length === 0
        ?
          <VscodeProgressRing style={{width: "50px", height: "50px", textAlign: "center"}}/>
        : <></>
        }
        <div
          style={{
            padding: "10px",
            margin: "10px 0",
            height: "100px",
            width: "310px",
          }}
        ></div>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          left: "0px",
          backgroundColor: "#00000070",
          height: "80px",
          width: "350px",
          paddingTop: "10px",
          paddingLeft: "10px",
        }}
      >
        <VscodeTextfield
          value={inputText}
          onChange={(e) =>
            setInputText((e?.target as HTMLTextAreaElement)?.value || "")
          }
          disabled={inputPhase === 5}
          min={3}
        />
        <br />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <VscodeButton
            disabled={inputPhase === 5}
            onClick={handleSecondaryButtonClick}
            secondary
          >
            {secondaryButtonText || "　"}
          </VscodeButton>
          <VscodeButton
            disabled={inputPhase === 5}
            onClick={handlePrimaryButtonClick}
          >
            {primaryButtonText || <VscodeIcon name="sync" />}
          </VscodeButton>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
