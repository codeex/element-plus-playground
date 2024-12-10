import { Files } from "./PlaygroundContext";
import importMap from "./template/import-map.json?raw";
import App from "./template/App.tsx?raw";
import AppCss from "./template/App.css?raw";
import main from "./template/main.tsx?raw";
import { getLanguageByFileName } from "./utils";

export const APP_COMPONENT_FILE_NAME = "App.tsx";
export const IMPORT_MAP_FILE_NAME = "import-map.json";
export const APP_CSS_FILE_NAME = "App.css";
export const ENTRY_FILE_NAME = "main.tsx";

export const initFiles: Files = {
  [ENTRY_FILE_NAME]: {
    name: ENTRY_FILE_NAME,
    show: false,
    language: getLanguageByFileName(ENTRY_FILE_NAME),
    value: main,
  },
  [APP_COMPONENT_FILE_NAME]: {
    name: APP_COMPONENT_FILE_NAME,
    show: true,
    language: getLanguageByFileName(APP_COMPONENT_FILE_NAME),
    value: App,
  },
  [IMPORT_MAP_FILE_NAME]: {
    name: IMPORT_MAP_FILE_NAME,
    show: true,
    language: getLanguageByFileName(IMPORT_MAP_FILE_NAME),
    value: importMap,
  },
  [APP_CSS_FILE_NAME]: {
    name: APP_CSS_FILE_NAME,
    show: true,
    language: getLanguageByFileName(APP_CSS_FILE_NAME),
    value: AppCss,
  }
};
