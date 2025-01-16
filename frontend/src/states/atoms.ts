import { atom } from "recoil";

export const usernameAtom = atom({
  key: "usernameState",
  default: "",
});
export const roomAtom = atom({
  key: "roomState",
  default: "",
});
