import { FC, useEffect } from "react";
import { BackHandler } from "react-native";

export default function useBackHandler(handler:()=>boolean|null|undefined):void {
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handler);

    return () => BackHandler.removeEventListener("hardwareBackPress", handler);
  }, [handler]);
}