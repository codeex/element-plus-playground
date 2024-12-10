# Fabric Js Playground

## 下载与分享

分享代码就是将`files`对象通过`JSON.stringfy`并压缩后保存到`location.hash`中，并复制链接到剪贴板。然后初始化的时候从`location.hash`读取出来`JSON.parse`并解压缩。压缩用的是`fflate`包。

代码下载则是基于`jszip`和`file-saver`包实现的。

##  代码在 React Playground 上改造  

  感谢 React Playground 作者