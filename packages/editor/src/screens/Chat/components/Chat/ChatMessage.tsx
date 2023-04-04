import { Message } from "../../../../types";
import { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "../Markdown/CodeBlock";
import styles from './styles.module.css';

interface Props {
  message: Message;
}

export const ChatMessage: FC<Props> = ({ message }) => {
  return (
    <div
      className={`${styles.group} ${message.role === "assistant" ? styles.aiMessage : styles.userMessage}`}
      style={{ overflowWrap: "anywhere" }}
    >
      <div className={styles.contentWrapper}>
        <div className={styles.roleLabel}>{message.role === "assistant" ? "AI:" : "You:"}</div>

        <div className={styles.prose}>
          {message.role === "user" ? (
            <div className={`${styles.prose} ${styles.whitespacePreWrap}`}>{message.content}</div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <CodeBlock
                      key={Math.random()}
                      language={match[1]}
                      value={String(children).replace(/\n$/, "")}
                      {...props}
                    />
                  ) : (
                    <code
                      className={className}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                table({ children }) {
                  return <table className={styles.table}>{children}</table>;
                },
                th({ children }) {
                  return <th className={styles.th}>{children}</th>;
                },
                td({ children }) {
                  return <td className={styles.td}>{children}</td>;
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );

};
