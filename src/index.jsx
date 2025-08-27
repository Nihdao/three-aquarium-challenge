import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import { KeyboardControls } from "@react-three/drei";
import { Interface } from "./Interface.jsx";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <KeyboardControls
    map={[
      { name: "moveForward", keys: ["ArrowUp", "KeyW"] },
      { name: "moveBackward", keys: ["ArrowDown", "KeyS"] },
      { name: "moveLeft", keys: ["ArrowLeft", "KeyA"] },
      { name: "moveRight", keys: ["ArrowRight", "KeyD"] },
      { name: "swimFast", keys: ["Shift"] },
      { name: "moveDown", keys: ["KeyC"] },
      { name: "moveUp", keys: ["Space"] },
    ]}
  >
    <Canvas
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 1000,
      }}
    >
      <Experience />
    </Canvas>
    <Interface />
  </KeyboardControls>
);
