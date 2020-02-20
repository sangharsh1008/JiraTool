const screenshot = window.require("screenshot-desktop");

const { remote } = window.require("electron");

export const getScreenShotImage = callback => {
  const activeWindow = remote.BrowserWindow.getFocusedWindow();
  activeWindow.minimize();
  setTimeout(() => {
    screenshot
      .all()
      .then(imgArr => {
        let imgBuffer;

        if (imgArr.length === 1) {
          imgBuffer = imgArr[0];
          let image = new Image();
          image.src = `data:image/png;base64, ${imgBuffer.toString("base64")}`;

          image.onload = function() {
            activeWindow.restore();
            const imageWid = image.width + 200;
            console.log(image.width + image.width / 5, "sangharsh");
            callback(image.src, "", {
              width: imageWid,
              height: image.height
            });
          };
        } else {
          imgBuffer = imgArr[0];
          let imgBuffer2 = imgArr[1];
          let image1 = new Image();
          let image = new Image();
          image.src = `data:image/png;base64, ${imgBuffer.toString("base64")}`;
          image1.src = `data:image/png;base64, ${imgBuffer2.toString(
            "base64"
          )}`;
          image.onload = function() {
            callback(image.src, image1.src, {
              width: image.width + 400,
              height: image.height
            });
          };
        }
      })
      .catch(err => {
        console.error(err.message);
      });
  });
};
