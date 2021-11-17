module.exports = {
    devServer: {
      open: true,// vue项目启动时自动打开浏览器
      host: 'localhost',
      port: 8080,
      proxy: {
        '/': { // '/api'是代理标识，用于告诉node，url前面是/api的就是使用代理的
          target: "http://localhost:3000", //目标地址，一般是指后台服务器地址
          ws:true,
          changeOrigin: true, //是否跨域
          pathRewrite: { // pathRewrite 的作用是把实际Request Url中的'/api'用""代替
            '^/api': "" 
          }
        }
      }
    }
  }