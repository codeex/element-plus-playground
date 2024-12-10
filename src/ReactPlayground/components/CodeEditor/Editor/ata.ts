import { setupTypeAcquisition } from '@typescript/ata'
import typescriprt from 'typescript';

export function createATA(onDownloadFile: (code: string, path: string) => void) {
  // 初始化ata函数，ata函数用来自动下载用到的类型包
  const ata = setupTypeAcquisition({
    projectName: 'my-ata',
    typescript: typescriprt,
    logger: console,
    delegate: {
      receivedFile: (code, path) => {
        onDownloadFile(code, path);
      }
    },
  })

  // ata是个函数，传入源码，自动分析出需要的 ts 类型包，然后自动下载
  return ata;
}
