import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import Player from "./Player.jsx";
import { Physics } from "@react-three/rapier";
import useGame from "./stores/useGame.jsx";
import { Perf } from "r3f-perf";

export default function Experience() {
  return (
    <>
      <Perf position="top-left" />

      <color attach="background" args={["#bdedfc"]} />
      <OrbitControls makeDefault />

      <Physics>
        <Lights />

        {/* <Level count={blocksCount} seed={blockSeed} /> */}
        <Player />
      </Physics>
    </>
  );
}
