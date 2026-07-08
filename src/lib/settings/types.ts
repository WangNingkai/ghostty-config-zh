import type {HexColor} from "$lib/utils/colors";

export type GhosttyPlatform = "macos" | "linux" | "gtk" | "gtk-wayland" | "gtk-x11";

export interface SettingInfo {
    key: string; // the actual ghostty config key, e.g. "window-padding-x"
    name: string; // display label
    note?: string; // short curated HTML hint
    description: string; // full markdown help text from ghostty schema
    platform?: GhosttyPlatform[];
    since?: string;
    repeatable?: boolean;
    disabled?: boolean;
    deprecated?: boolean | string;
}

interface SwitchSetting extends SettingInfo {
    type: "switch";
    default: boolean;
}

interface TextSetting extends SettingInfo {
    type: "text";
    default: string;
    placeholder?: string;
    size?: number;
}

interface NumberSetting extends SettingInfo {
    type: "number";
    default: number | undefined;
    min?: number;
    max?: number;
    step?: number;
    size?: number;
    placeholder?: string;
}

interface RangeSetting extends SettingInfo {
    type: "range";
    default: number;
    min: number;
    max: number;
    step?: number;
    showLabels?: boolean;
}

export interface DropdownOption {
    name: string;
    value: string;
    description?: string;
    icon?: string;
    group?: string;
    disabled?: boolean;
}

interface DropdownSetting extends SettingInfo {
    type: "dropdown";
    default: string;
    options: Array<DropdownOption | string>;
    searchable?: boolean;
    placeholder?: string;
    allowEmpty?: boolean;
    emptyLabel?: string;
}

interface ColorSetting extends SettingInfo {
    type: "color";
    default: HexColor | "";
}

interface PaletteSetting extends SettingInfo {
    type: "palette";
    default: HexColor[];
}

interface ThemeSetting extends SettingInfo {
    type: "theme";
    default: string;
    options: Array<DropdownOption | string>;
}

// Maybe move this to keybind module?
export type KeybindString = `${string}=${string}`;

interface KeybindsSetting extends SettingInfo {
    type: "keybinds";
    default: KeybindString[];
}

// --- Phase A0: new-component widget types (see notes/plans/settings-component-integration.md §1) ---
// These `type` members are intentionally temporary plumbing for the existing type-based renderer.
// Phase A migrates widget selection into navigation (WidgetDef) and removes them. Keep minimal.

export type PillVariant = "neutral" | "accent" | "danger";

export interface PillOption {
    label: string;
    value: string;
    variant?: PillVariant;
}

export interface FeatureDef {
    id: string; // e.g. 'cursor', 'sudo'
    label: string; // e.g. 'Cursor', 'Sudo'
    default: boolean; // the actual Ghostty default for this feature
    description?: string;
}

// A preset/"special" value for CustomColor / CustomNumber (structurally CustomInput's Preset).
export interface SpecialValue {
    value: string; // e.g. 'bright', 'cell-foreground', 'macos-glass-regular'
    label: string; // e.g. 'Bright', 'Cell FG', 'Regular'
    description?: string;
    variant?: PillVariant;
}

interface RepeatableTextSetting extends SettingInfo {
    type: "repeatable-text";
    default: string[];
    placeholder?: string;
    canReorder?: boolean;
}

interface FeatureListSetting extends SettingInfo {
    type: "feature-list";
    default: string;
    features: FeatureDef[];
}

interface PillSetting extends SettingInfo {
    type: "pill";
    default: string;
    options: PillOption[];
}

interface DurationSetting extends SettingInfo {
    type: "duration";
    default: string;
    allowEmpty?: boolean;
    placeholder?: string;
}

interface DualNumberSetting extends SettingInfo {
    type: "dual-number";
    default: string;
    labels: [string, string];
    min?: number;
    max?: number;
    step?: number;
}

interface CustomColorSetting extends SettingInfo {
    type: "custom-color";
    default: string;
    presets: SpecialValue[];
    widget?: "dropdown" | "pills";
}

interface CustomNumberSetting extends SettingInfo {
    type: "custom-number";
    default: string;
    presets: SpecialValue[];
    min?: number;
    max?: number;
    step?: number;
    size?: number;
    placeholder?: string;
    integer?: boolean;
    widget?: "dropdown" | "pills";
}

interface ScrollMultiplierSetting extends SettingInfo {
    type: "scroll-multiplier";
    default: string;
}

interface NumberUnitsSetting extends SettingInfo {
    type: "number-units";
    default: string;
}

export type SettingDef =
    | SwitchSetting
    | TextSetting
    | NumberSetting
    | RangeSetting
    | DropdownSetting
    | ColorSetting
    | PaletteSetting
    | ThemeSetting
    | KeybindsSetting
    | RepeatableTextSetting
    | FeatureListSetting
    | PillSetting
    | DurationSetting
    | DualNumberSetting
    | CustomColorSetting
    | CustomNumberSetting
    | ScrollMultiplierSetting
    | NumberUnitsSetting;

export type TypeToValue<T extends SettingDef["type"]> = Extract<SettingDef, {type: T;}>["default"];

export type SettingsRegistry = Record<string, SettingDef>;

// Keys for the group preview components. The union lives here (data-only) so navigation can
// reference it while the renderer-side previews map implements `Record<PreviewKey, Component>` —
// nav keys are checked valid and the map is checked exhaustive, both against this one list.
export type PreviewKey = "baseColor" | "cursor" | "palette" | "appIcon";

// WidgetDef: widget selection + metadata, living in navigation.
// It is data-only, a string discriminant plus plain params,
// so navigation.ts stays free of `.svelte` imports and validateNavigation()/Bun tests stay clean.
// Array/tuple fields are `readonly` so nav's `as const satisfies` literals assign cleanly; the
// renderer casts to the mutable shapes its components expect at the (few) call sites that pass them.
export type WidgetDef =
    | {type: "switch";}
    | {type: "text"; placeholder?: string; size?: number;}
    | {type: "number"; min?: number; max?: number; step?: number; size?: number; placeholder?: string; integer?: boolean;}
    | {type: "range"; min: number; max: number; step?: number; showLabels?: boolean;}
    | {type: "dropdown"; options: ReadonlyArray<DropdownOption | string>; searchable?: boolean; allowEmpty?: boolean; emptyLabel?: string; placeholder?: string;}
    | {type: "color";}
    | {type: "palette";}
    | {type: "theme"; options: ReadonlyArray<DropdownOption | string>;}
    | {type: "keybinds";}
    | {type: "repeatable-text"; placeholder?: string; canReorder?: boolean;}
    | {type: "feature-list"; features: readonly FeatureDef[];}
    | {type: "pill"; options: readonly PillOption[];}
    | {type: "duration"; allowEmpty?: boolean; placeholder?: string;}
    | {type: "dual-number"; labels: readonly [string, string]; min?: number; max?: number; step?: number;}
    | {type: "custom-color"; presets: readonly SpecialValue[]; widget?: "dropdown" | "pills";}
    | {type: "custom-number"; presets: readonly SpecialValue[]; min?: number; max?: number; step?: number; size?: number; placeholder?: string; integer?: boolean; widget?: "dropdown" | "pills";}
    | {type: "scroll-multiplier";}
    | {type: "number-units";};