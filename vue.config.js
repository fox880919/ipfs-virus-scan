module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],

  configureWebpack: {
    node: {
      fs:'empty'
    }
  }
}