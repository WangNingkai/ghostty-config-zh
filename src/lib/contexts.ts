import {createContext} from "svelte";
import type {SettingInfo} from "./settings/types";


export const [getSetting, setSetting] = createContext<Omit<SettingInfo, "key">>();