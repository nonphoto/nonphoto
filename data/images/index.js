import S from "s-js";

import sprayImage from "./spray.png";
import classonDemoImage from "./classon-demo.png";
import classonDemoVideo from "./classon-demo.mp4";

export default [
  {
    id: "spray",
    ref: S.data(),
    image: sprayImage,
  },
  {
    id: "classon-demo",
    ref: S.data(),
    image: classonDemoImage,
    video: classonDemoVideo,
  },
];
