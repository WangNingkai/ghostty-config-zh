<script lang="ts">
    import Number from "./Number.svelte";
    import PillButtonGroup, {type PillOption} from "./PillButtons.svelte";

    export interface Option {
        value: string; // e.g. "off", "on", "glass"
        label: string; // e.g. "Off", "On", "Glass"
    }

    interface Props {
        value: string; // number, special string, or '' (unset)
        presets: Option[]; // which special values this setting supports
    }

    // eslint-disable-next-line prefer-const
    let {value = $bindable(""), presets: specials}: Props = $props();

    const isOption = (v: string): boolean => specials.some(s => s.value === v);

    let mode = $derived(isOption(value) ? value : "custom");

    // Use an iife because svelte linting
    let customNumber = $state<number>((() => isOption(value) ? 0 : parseInt(value))());

    const pillOptions = $derived<PillOption[]>([
        {label: "Custom", value: "custom", variant: "neutral"},
        ...specials.map(s => ({label: s.label, value: s.value, variant: "accent" as const})),
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
    <Number bind:value={() => customNumber, onNumberChange} />

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
