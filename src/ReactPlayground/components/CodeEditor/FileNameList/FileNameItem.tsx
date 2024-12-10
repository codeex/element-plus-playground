import classnames from "classnames";
import styles from "./index.module.scss";
import { useEffect, useRef, useState } from "react";
import { Popconfirm } from "antd";

export interface FileNameItemProps {
  value: string;
  actived: boolean;
  creating: boolean;
  readonly: boolean;
  show: boolean;
  onRemove: () => void;
  onEditComplete: (name: string) => void;
  onClick: () => void;
}

const FileNameItem: React.FC<FileNameItemProps> = (props) => {
  const {
    value,
    actived,
    readonly,
    creating,
    show,
    onRemove,
    onClick,
    onEditComplete,
  } = props;

  const [name, setName] = useState(value);
  const [editing, setEditing] = useState(creating);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (creating) {
      inputRef.current?.focus();
    }
  }, [creating]);

  const handleDoubleClick = () => {
    setEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };
  const handleBlur = () => {
    setEditing(false);
    onEditComplete(name);
  };

  return (
    show &&
    <div
      onClick={onClick}
      className={classnames(
        styles["tab-item"],
        actived ? styles.actived : null
      )}
    >
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          className={styles["tabs-item-input"]}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          onBlur={handleBlur}
        />
      ) : (
        <>
          <span onDoubleClick={!readonly ? handleDoubleClick : () => {}}>
            {name}
          </span>
          {!readonly ? (
            <Popconfirm
              title="确认删除该文件吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={(e) => {
                e?.stopPropagation(); // 停止冒泡
                onRemove();
              }}
            >
              <span
                style={{ marginLeft: 5, display: "flex" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24">
                  <line stroke="#999" x1="18" y1="6" x2="6" y2="18"></line>
                  <line stroke="#999" x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </span>
            </Popconfirm>
          ) : null}
        </>
      )}
    </div>
  );
};

export default FileNameItem;
