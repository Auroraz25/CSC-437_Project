export default {
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      },
      "/auth": {
        target: "http://localhost:3000", 
        changeOrigin: true
      }

    }
  }
};