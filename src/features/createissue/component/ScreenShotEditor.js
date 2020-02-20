import React from "react";
import {
  Stage,
  Shape,
  Bitmap,
  Rectangle,
  Ticker,
  Text,
  Container
} from "@createjs/easeljs";
import { StyledButton } from "app/common/component/StylePage";
import { getScreenShotImage } from "../../../utils/screenshotUtils";
const ColorPalet = ["white", "red", "green", "blue", "yellow"];
var fs = window.require("fs");
var request = window.require("request");
const canvasSize = { Width: 800, height: 500 };

const scaleValue = 0.5;
class ScreenShotEditor extends React.Component {
  state = {
    bounds: {
      ...canvasSize
    },
    cropBounds: {
      width: 0,
      height: 0,
      x: 0,
      y: 0
    },
    textPosition: {
      x: 0,
      y: 0
    },
    text: "",
    windowSize: {
      width: 0,
      height: 0
    },
    zoom: 0,
    color: "red"
  };
  initialLoad() {
    console.log(window.outerWidth, "  window.resizeTo", window.outerHeight);
    getScreenShotImage((imageSrc1, imageSrc2 = "", windowSize) => {
      window.resizeTo(windowSize.width, windowSize.height);
      const tempCanvasSize = {
        width: windowSize.width,
        height: windowSize.height
      };
      this.setState({
        imageSrc: imageSrc1,
        imgSrc2: imageSrc2,
        windowSize: windowSize,
        bounds: { ...tempCanvasSize }
      });

      this.init();
      window.addEventListener("scroll", param => {
        if (window.document.body.getBoundingClientRect().top < 0) {
          const { zoom } = this.state;
          this.setState({
            zoom: zoom + 0.2
          });
        } else {
          const { zoom } = this.state;
          this.setState({
            zoom: zoom - 0.2
          });
        }
      });
      Ticker.addEventListener("tick", e => {
        this.stage.update();
      });
    });
  }
  componentDidMount() {
    this.initialLoad();
  }

  textEditor = ev => {
    this.stage.addEventListener("pressup", this.enableTextEditor);
  };

  cropImageFunction = () => {
    this.stage.alpha = 0.3;
    this.stage.addEventListener("mousedown", this.enableCropSection);

    this.stage.addEventListener("pressmove", this.dragCropArea);
    this.stage.addEventListener("pressup", this.setCropImage);
  };

  enableTextEditor = e => {
    this.setState({ textPosition: { x: e.stageX, y: e.stageY } });
    if (this.title) {
      this.writeTextOnCanvas();
    } else {
      this.createTextField();
    }
  };

  createTextField = () => {
    this.title = document.createElement("input");
    this.title.style.position = "absolute";
    this.title.type = "text";
    this.title.addEventListener("keyup", event => {
      if (event.keyCode === 13) this.writeTextOnCanvas();
      this.setState({ text: event.target.value });
    });
    const {
      textPosition: { x, y }
    } = this.state;

    this.title.style.top = `${y}px`;
    this.title.style.left = `${x}px`;
    this.title.style.color = this.state.color;
    this.title.style.background = `transparent`;
    this.container.current.style.position = "relative";
    this.container.current.append(this.title);

    this.title.focus();
  };
  writeTextOnCanvas = () => {
    const {
      textPosition: { x, y },
      text
    } = this.state;

    const textMessg = new Text(text, "20px Arial", this.state.color);
    textMessg.x = x;
    textMessg.y = y;
    this.stage.addChild(textMessg);
    this.container.current.style.position = "static";
    this.container.current.removeChild(this.title);
    this.setState({ text: "" });
    this.title = null;
    textMessg.addEventListener("pressmove", e => {
      const { stageX, stageY } = e;
      textMessg.x = stageX;
      textMessg.y = stageY;
    });
    this.stage.removeEventListener("pressup", this.enableTextEditor);
  };

  setCropImage = e => {
    this.stage.alpha = 1;
    setTimeout(() => {
      const {
        cropBounds,
        cropBounds: { width, height, x, y }
      } = this.state;
      const tempWindowSize = {
        width: cropBounds.width + 20,
        height: cropBounds.height + 20
      };

      this.cropImage = new Bitmap(this.stage.toDataURL());

      this.cropImage.sourceRect = new Rectangle(x, y, width, height);

      this.stage.removeAllChildren();
      this.setState({ bounds: this.bitmap.getBounds() });
      this.stage.setBounds(0, 0, width, height);
      this.stage.addChild(this.cropImage); //remove Event listenerssetCropImage

      this.setState({
        windowSize: tempWindowSize
      });
    }, 200);
    this.stage.removeEventListener("pressup", this.setCropImage);
    this.stage.removeEventListener("mousedown", this.enableCropSection);
    this.stage.removeEventListener("pressmove", this.dragCropArea);
  };

  dragCropArea = e => {
    const { stageX, stageY } = e;
    const width = stageX - this.newRect.x;
    const height = stageY - this.newRect.y;
    this.newRect.graphics
      .clear()
      .beginStroke("black")
      .drawRect(0, 0, width, height);
    this.setState({
      cropBounds: { ...this.state.cropBounds, width: width, height: height }
    });
  };

  enableCropSection = e => {
    console.log(e, e.stageX, e.stageY);
    this.newRect && this.stage.removeChild(this.newRect);
    this.newRect = new Shape();
    this.newRect.graphics.beginStroke("black").drawRect(0, 0, 1, 1);
    const { stageX, stageY } = e;
    this.newRect.x = stageX;
    this.newRect.y = stageY;
    this.stage.addChild(this.newRect);
    this.setState({
      cropBounds: { ...this.state.cropBounds, x: stageX, y: stageY }
    });
  };

  drawRectangle = () => {
    this.stage.addEventListener("mousedown", this.enableRectangle);

    this.stage.addEventListener("pressmove", this.dragRectangle);
    this.stage.addEventListener("pressup", this.removeAllListeners);
  };
  enableRectangle = e => {
    this.drawRect = new Shape();
    this.drawRect.graphics.beginStroke(this.state.color).drawRect(0, 0, 1, 1);
    const { stageX, stageY } = e;
    this.drawRect.x = stageX;
    this.drawRect.y = stageY;
    this.stage.addChild(this.drawRect);
  };
  dragRectangle = e => {
    // console.log(e);
    const { stageX, stageY } = e;
    const width = stageX - this.drawRect.x;
    const height = stageY - this.drawRect.y;
    this.drawRect.graphics
      .clear()
      .setStrokeStyle(5)
      .beginStroke(this.state.color)
      .drawRect(0, 0, width, height);
  };

  removeAllListeners = () => {
    this.stage.removeEventListener("mousedown", this.enableRectangle);
    this.stage.removeEventListener("pressmove", this.dragRectangle);
    this.stage.removeEventListener("pressup", this.removeAllListeners);
  };

  init = () => {
    window.aa = this;
    const { imageSrc, imgSrc2, windowSize } = this.state;

    this.stage = new Stage("canvas");
    window.Bitmap = Bitmap;
    this.bitmap = new Bitmap(imageSrc);
    this.bitmap.scaleX = imgSrc2 === "" ? scaleValue + 0.2 : scaleValue;
    this.bitmap.scaleY = imgSrc2 === "" ? scaleValue + 0.2 : scaleValue;
    this.imageContainer1 = new Container();
    this.imageContainer1.addChild(this.bitmap);
    this.imageContainer2 = new Container();
    if (imgSrc2 !== "") {
      this.bitmap2 = new Bitmap(imgSrc2);
      this.bitmap2.scaleX = scaleValue;
      this.bitmap2.scaleY = scaleValue + 0.2;
      this.bitmap.scaleY += 0.2;
      this.imageContainer2.addChild(this.bitmap2);
    }

    this.stage.addChild(this.imageContainer1, this.imageContainer2);

    this.imageContainer2.x = this.bitmap.getBounds().width * scaleValue + 20;
    this.bitmap = new Bitmap(this.stage.toDataURL());

    this.stage.addChild(this.bitmap);
    if (imgSrc2 !== "") {
      // this.stage.setBounds(0,0,windowSize.width,windowSize.height)
    }

    this.bitmap.getBounds() &&
      this.setState({ bounds: this.bitmap.getBounds() });
  };

  container = React.createRef();

  // download(uri, filename, callback) {
  //   request.head(uri, function(err, res, body) {
  //     request(uri)
  //       .pipe(fs.createWriteStream(filename))
  //       .on("close", callback);
  //   });
  // }
  displayColorPalet() {
    return ColorPalet.map(value => {
      return (
        <button
          onClick={() => this.setState({ color: value })}
          style={{
            background: value,
            width: "15px",
            height: "15px",
            border: "1px solid black",
            margin: "3px"
          }}
        ></button>
      );
    });
  }
  render() {
    const {
      windowSize: { height, width },
      imgSrc2
    } = this.state;
    if (this.props.isShowScreenShotPage) {
      window.resizeTo(1400, 1200);
    }

    return (
      <div
        style={{
          width: width,
          height: height,
          position: "absolute",
          top: "0",
          left: "0",
          background: "white"
        }}
      >
        <div style={{ width: "100%", height: "10%" }}>
          {this.displayColorPalet()}
          <button
            style={{ margin: "5px", color: "black" }}
            onClick={this.cropImageFunction}
          >
            <i className="glyphicon glyphicon-scissors" aria-hidden="true"></i>
          </button>{" "}
          <button
            style={{ margin: "5px", color: "black" }}
            onClick={this.textEditor}
          >
            <i className="glyphicon glyphicon-text-size" aria-hidden="true"></i>
          </button>
          <button
            style={{ margin: "5px", color: "black" }}
            onClick={this.drawRectangle}
          >
            <i className="glyphicon glyphicon-unchecked" aria-hidden="true"></i>
          </button>
          <StyledButton
            onClick={() => {
              const path = "./image.png";
              //
              fs.existsSync(path) &&
                fs.unlink(path, err => {
                  if (err) {
                    console.error(err);
                    return;
                  }
                });

              var base64Data = this.stage
                .toDataURL()
                .replace(/^data:image\/png;base64,/, "");

              // //
              window
                .require("fs")
                .writeFile("./image.png", base64Data, "base64", function(err) {
                  // console.log(err);
                });
              this.props.setScreenShotImage(base64Data);
              //added original size of window
              window.resizeTo(375, 452);
              setTimeout(() => {
                this.props.toggleScreenShotPage();
              });
            }}
            style={{ marginRight: "10px" }}
            name="Done"
          />
          <StyledButton
            onClick={() => {
              const path = "./image.png";

              fs.existsSync(path) &&
                fs.unlink(path, err => {
                  if (err) {
                    console.error(err);
                    return;
                  }
                });

              this.props.setScreenShotImage("");
              window.resizeTo(375, 452);
              setTimeout(() => {
                this.props.toggleScreenShotPage();
              });
            }}
            style={{ marginLeft: "10px" }}
            name="Cancel"
          />
          <StyledButton
            style={{ marginLeft: "20px" }}
            onClick={() => {
              setTimeout(() => {
                this.stage.removeAllChildren();
                this.initialLoad();
              });
            }}
            name="Retake Snapshot"
          />
        </div>
        <div
          style={{
            height: "90%",
            width: "100%",
            color: "black",
            display: "flex"
          }}
          className="App"
        >
          <div
            ref={this.container}
            style={{
              width: "90%",
              height: "100%",
              margin: "20px"
            }}
          >
            <canvas id="canvas" width={width} height={height} />
             
          </div>
        </div>
      </div>
    );
  }
}

export default ScreenShotEditor;
