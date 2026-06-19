<script lang="ts">
    import type {HexColor} from "$lib/utils/colors";
    import Color from "./Color.svelte";
    import PillButtonGroup, {type PillOption} from "./PillButtons.svelte";

    export interface Preset {
        value: string; // e.g. 'bright', 'cell-foreground', 'cell-background'
        label: string; // e.g. 'Bright', 'Cell FG', 'Cell BG'
    }

    interface Props {
        value: string; // hex color, special string, or '' (unset)
        presets: Preset[]; // which special values this setting supports
        default?: HexColor; // passed through to Color for reset
    }

    // eslint-disable-next-line prefer-const
    let {value = $bindable(""), presets: specials, default: defaultValue}: Props = $props();

    const isPreset = (v: string): boolean => specials.some(s => s.value === v);

    const mode = $derived(isPreset(value) ? value : "custom");

    // Use an iife because svelte linting
    let customColor = $state<HexColor>((() => isPreset(value) ? defaultValue ?? "#ffffff" : value as HexColor)());

    const pillOptions = $derived<PillOption[]>([
        {label: "Custom", value: "custom", variant: "neutral"},
        ...specials.map(s => ({label: s.label, value: s.value, variant: "accent" as const})),
    ]);


    function onModeChange(next: string) {
        if (next === "custom") value = customColor;
        else value = next;
    }

    // Track hex changes from the color picker
    function onColorChange(hex: HexColor) {
        if (mode !== "custom") return; // shouldn't happen since Color is disabled in non-custom mode, but just in case
        customColor = hex;
        value = hex;
    }
</script>

<div class="custom-color">
    <Color
        bind:value={() => customColor, onColorChange} // TODO: use functional binds like this more often instead of onchange
        {defaultValue}
        disabled={mode !== "custom"}
    />
    <PillButtonGroup
        value={mode}
        options={pillOptions}
        onchange={onModeChange}
    />
</div>

<style>
.custom-color {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}
</style>
