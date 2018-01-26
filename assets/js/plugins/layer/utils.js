let layerUtils = {
  createTemplate: function (config) {
    let boxType = config.boxType;
    return `<div class="${boxType}-box">
      <div class="${boxType}-content">${config.content}</div>
    </div>`;
  }
}

module.exports = layerUtils
