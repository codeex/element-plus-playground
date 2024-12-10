import { useContext, useEffect, useState } from "react";
import { PlaygroundContext } from "../../../PlaygroundContext";
import FileNameItem from "./FileNameItem";
import styles from "./index.module.scss";
import {
  APP_COMPONENT_FILE_NAME,
  ENTRY_FILE_NAME,
  IMPORT_MAP_FILE_NAME,
} from "../../../files";

export default function FileNameList() {
  const {
    files,
    removeFile,
    addFile,
    updateFileName,
    selectedFileName,
    setSelectedFileName,
  } = useContext(PlaygroundContext);

  const [tabs, setTabs] = useState([""]);
  const [creating, setCreating] = useState(false);
  useEffect(() => {
    setTabs(Object.keys(files));
  }, [files]);

  const handleEditComplete = (name: string, oldName: string) => {
    setSelectedFileName(name);
    updateFileName(oldName, name);
  };
  const addTab = () => {
    let name = `Comp${Math.random().toString().slice(2, 6)}.js`;
    addFile(name);
    setCreating(true);
  };
  const handleRemove = (name: string) => {
    removeFile(name);
    setSelectedFileName(ENTRY_FILE_NAME);
  };

  const readonlyFileNames = [
    ENTRY_FILE_NAME,
    IMPORT_MAP_FILE_NAME,
    APP_COMPONENT_FILE_NAME,
  ];
  const hiddenFileNames = [
    ENTRY_FILE_NAME,   
    IMPORT_MAP_FILE_NAME,
  ];

  return (
    <div className={styles.tabs}>
      {tabs.map((fileName, index) => (
        <FileNameItem
          key={fileName}
          value={fileName}
          creating={creating && index === tabs.length - 1}
          actived={selectedFileName === fileName}
          show = {!hiddenFileNames.includes(fileName)}
          readonly={readonlyFileNames.includes(fileName)}
          onClick={() => setSelectedFileName(fileName)}
          onEditComplete={(name: string) => handleEditComplete(name, fileName)}
          onRemove={() => {
            handleRemove(fileName)
          }}
        />
      ))}
      <div className={styles.add} onClick={addTab}>
        +
      </div>
    </div>
  );
}
