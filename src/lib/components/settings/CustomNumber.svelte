<script lang="ts">
    import Dropdown from "./Dropdown.svelte";
    import Number from "./Number.svelte";
    import PillButtonGroup, {type PillOption} from "./PillButtons.svelte";

    export interface Option {
        value: string; // e.g. "off", "on", "glass"
        label: string; // e.g. "Off", "On", "Glass"
        description?: string; // optional description for the option
    }

    interface Props {
        value: string; // number, special string, or '' (unset)
        presets: Option[]; // which special values this setting supports
        min?: number;
        max?: number;
        step?: number;
        size?: number;
        placeholder?: string;
        integer?: boolean;
        widget?: "dropdown" | "pills"; // default: pills if 2 or fewer presets, dropdown if more than 2
    }

    // eslint-disable-next-line prefer-const
    let {value = $bindable(""), presets: specials, min, max, step, size, placeholder, integer, widget}: Props = $props();

    const isOption = (v: string): boolean => specials.some(s => s.value === v);

    let mode = $derived(isOption(value) ? value : "custom");

    // Use an iife because svelte linting
    let customNumber = $state<number>((() => isOption(value) ? 0 : parseFloat(value))());

    const shouldUseDropdown = $derived.by(() => {
        if (widget === "dropdown") return true;
        if (widget === "pills") return false;
        return specials.length > 2;
    });
    const pillOptions = $derived<PillOption[]>([
        {label: "Custom", value: "custom", variant: "neutral"},
        ...specials.map(s => ({label: s.label, value: s.value, variant: "accent" as const})),
    ]);

    const dropdownOptions = $derived([
        {name: "Custom", value: "custom"},
        ...specials.map(s => ({name: s.label, value: s.value, description: s.description})),
    ]);


    function onModeChange(next: string) {
        if (next === "custom") value = customNumber.toString();
        else value = next;
    }

    // Track number changes from the number spinner
    function onNumberChange(num: number) {
        customNumber = num;
        if (mode !== "custom") mode = "custom"; // switch to custom mode if not already there
        value = customNumber.toString();
    }
</script>

<div class="custom-color">
    {#if shouldUseDropdown}
        <Dropdown
            value={mode}
            options={dropdownOptions}
            change={onModeChange}
        />
    {/if}

    <Number bind:value={() => customNumber, onNumberChange} {min} {max} {step} {size} {placeholder} {integer} />

    {#if !shouldUseDropdown}
        <PillButtonGroup
            value={mode}
            options={pillOptions}
            onchange={onModeChange}
        />
    {/if}
</div>

<style>
.custom-color {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}
</style>
