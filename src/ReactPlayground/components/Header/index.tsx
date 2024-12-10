import styles from "./index.module.scss";
import logoSvg from "./icons/logo.svg"; // vite做的处理，引入 .svg 会返回它的路径
import {
  MoonOutlined,
  SunOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { Select } from "antd";
import { gte } from 'semver'
import { useContext, useEffect, useState } from "react";
import { PlaygroundContext } from "../../PlaygroundContext";
import copy from "copy-to-clipboard";
import { message } from "antd";
import { downloadFiles } from "../../utils";


export default function Header() {
  const { files, theme, setTheme, refresh } = useContext(PlaygroundContext);  
  const [currVersion, setCurrVersion] = useState<string>('latest');
  const [versions, setVersions] = useState<string[]>([]);
  const handleChange = (value:string)=>{
    refreshPreview(value);
  }
  //const compileWorkerRef = useRef<Worker>();
  function refreshPreview(fv: string) {
    refresh(fv)    
    setCurrVersion(fv);    
  }

  useEffect(() => {
    // POST request using fetch inside useEffect React hook
    const requestOptions = {
        method: 'GET',           
    };
    fetch('https://data.jsdelivr.com/v1/package/npm/fabric', requestOptions)
        .then(response => response.json())
        .then(data => setVersions((data.versions as string[]).filter(x => gte(x, '6.0.0') && !x.includes('beta'))));

// empty dependency array means this effect will only run once (like componentDidMount in classes)
}, []);
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <a href="https://fabricjs.cc" target="_blank" title="教程">
          <img alt="logo" src={logoSvg} />
        </a>
        <span><a href="/" title="首页">Fabric Js Playground</a></span>
      </div>
      <div>
        FabricJs:
        <Select style={{ width: 120, marginLeft: '10px' }}
          defaultValue={currVersion}
          options={
          versions.map(item => {
            return {
              'value': item,
              'label': item
            }
          })
        } onChange={handleChange} />
        <RetweetOutlined
          title="刷新预览窗"
          style={{ marginLeft: "10px",marginRight: "10px" }}
          onClick={() => refreshPreview(currVersion)}
        />
        {theme === "light" && (
          <SunOutlined
            title="切换暗色主题"
            className={styles.theme}
            onClick={() => setTheme("dark")}
          />
        )}
        {theme === "dark" && (
          <MoonOutlined
            title="切换亮色主题"
            className={styles.theme}
            onClick={() => setTheme("light")}
          />
        )}
        <ShareAltOutlined
          title="分享"
          style={{ marginLeft: "10px" }}
          onClick={() => {
            copy(window.location.href); // 复制到剪贴板
            message.success("分享链接已复制");
          }}
        />
        <DownloadOutlined
          title="下载"
          style={{ marginLeft: "10px" }}
          onClick={async () => {
            await downloadFiles(files);
            message.success("下载成功");
          }}
        />
      </div>
    </div>
  );
}
