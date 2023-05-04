const electronPublish = require('electron-publish');

class Publisher extends electronPublish.Publisher {
  async upload(task) {
    console.log('electron-publisher-custom', task.file);
  }
}
module.exports = Publisher;
