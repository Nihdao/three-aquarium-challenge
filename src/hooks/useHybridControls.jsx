import { useKeyboardControls } from "@react-three/drei";
import { useControlsStore } from "../stores/useControlsStore.jsx";
import { useEffect } from "react";

export function useHybridControls() {
  // États des contrôles clavier (KeyboardControls)
  const keyboardForward = useKeyboardControls((state) => state.moveForward);
  const keyboardBackward = useKeyboardControls((state) => state.moveBackward);
  const keyboardLeft = useKeyboardControls((state) => state.moveLeft);
  const keyboardRight = useKeyboardControls((state) => state.moveRight);
  const keyboardUp = useKeyboardControls((state) => state.moveUp);
  const keyboardDown = useKeyboardControls((state) => state.moveDown);
  const keyboardSwimFast = useKeyboardControls((state) => state.swimFast);

  // États des contrôles tactiles (Zustand store)
  const {
    moveForward: touchForward,
    moveBackward: touchBackward,
    moveLeft: touchLeft,
    moveRight: touchRight,
    moveUp: touchUp,
    moveDown: touchDown,
    swimFast: touchSwimFast,
    setControl,
  } = useControlsStore();

  // Synchroniser les contrôles clavier vers le store (pour que l'interface tactile reste synchronisée)
  useEffect(() => {
    setControl("moveForward", keyboardForward);
  }, [keyboardForward, setControl]);

  useEffect(() => {
    setControl("moveBackward", keyboardBackward);
  }, [keyboardBackward, setControl]);

  useEffect(() => {
    setControl("moveLeft", keyboardLeft);
  }, [keyboardLeft, setControl]);

  useEffect(() => {
    setControl("moveRight", keyboardRight);
  }, [keyboardRight, setControl]);

  useEffect(() => {
    setControl("moveUp", keyboardUp);
  }, [keyboardUp, setControl]);

  useEffect(() => {
    setControl("moveDown", keyboardDown);
  }, [keyboardDown, setControl]);

  useEffect(() => {
    setControl("swimFast", keyboardSwimFast);
  }, [keyboardSwimFast, setControl]);

  // Retourner l'état combiné (clavier OU tactile)
  return {
    moveForward: keyboardForward || touchForward,
    moveBackward: keyboardBackward || touchBackward,
    moveLeft: keyboardLeft || touchLeft,
    moveRight: keyboardRight || touchRight,
    moveUp: keyboardUp || touchUp,
    moveDown: keyboardDown || touchDown,
    swimFast: keyboardSwimFast || touchSwimFast,
  };
}
