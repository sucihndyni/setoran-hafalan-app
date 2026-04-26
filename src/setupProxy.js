const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://api.tif.uin-suska.ac.id",
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        "^/api": ""
      }
    })
  );
};