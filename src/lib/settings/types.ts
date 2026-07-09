export type GhosttyPlatform = "macos" | "linux" | "gtk" | "gtk-wayland" | "gtk-x11";

// A registry entry describes a Ghostty *config key* — nothing about how it renders. Widget
// selection + widget metadata live on the nav tree's `WidgetDef` (see navigation.ts). The only
// value-shape distinction that matters at the store level is `repeatable` (string[] vs string).
export interface SettingInfo {
    key: string; // the actual ghostty config key, e.g. "window-padding-x"
    name: string; // display label
    note?: string; // short curated HTML hint
    description: string; // full markdown help text from ghostty schema
    platform?: GhosttyPlatform[];
    since?: string;
    repeatable?: true; // present → value is string[]; absent → string. Literal `true` so the
    // registry's `satisfies` preserves it for the SettingValues mapped type.
    disabled?: boolean;
    deprecated?: boolean | string;
    default: string | string[]; // the config value at rest (Ghostty is a string format)
}

export type SettingsRegistry = Record<string, SettingInfo>;

// Maybe move this to keybind module?
export type KeybindString = `${string}=${string}`;

// --- Widget metadata (referenced by WidgetDef params below and by the renderer) ---

export interface DropdownOption {
    name: string;
    value: string;
    description?: string;
    icon?: string;
    group?: string;
    disabled?: boolean;
}

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
