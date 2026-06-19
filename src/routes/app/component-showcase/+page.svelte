<script lang="ts">
    import {dev} from "$app/environment";
    import {error} from "@sveltejs/kit";
    import Group from "$lib/components/settings/Group.svelte";
    import Item from "$lib/components/settings/Item.svelte";
    import Separator from "$lib/components/settings/Separator.svelte";
    import Dropdown from "$lib/components/settings/Dropdown.svelte";
    import Page from "$lib/views/Page.svelte";
    import {basicOptions, richOptions} from "./dropdown";
    import Checkbox from "$lib/components/settings/Checkbox.svelte";
    import Switch from "$lib/components/settings/Switch.svelte";
    import Color from "$lib/components/settings/Color.svelte";
    import type {HexColor} from "$lib/utils/colors";
    import LinkItem from "$lib/components/settings/LinkItem.svelte";
    import CogIconUrl from "$lib/images/tabs/application.webp";
    import Number from "$lib/components/settings/Number.svelte";
    import Range from "$lib/components/settings/Range.svelte";
    import Palette from "$lib/components/settings/Palette.svelte";
    import Text from "$lib/components/settings/Text.svelte";
    import RepeatableText from "$lib/components/settings/RepeatableText.svelte";
    import InlineRepeatableText from "$lib/components/settings/InlineRepeatableText.svelte";
    import PillButtons from "$lib/components/settings/PillButtons.svelte";

    if (!dev) error(404, "Not found");

    interface Values {
        dropdownBasic: string;
        dropdownRich: string;
        booleanCheckbox: boolean;
        booleanSwitch: boolean;
        colorBasic: HexColor;
        colorPalette: HexColor[];
        numberBasic: number;
        numberWithUndefined: number | undefined;
        numberFractional: number;
        rangeBasic: number;
        rangeLabeled: number;
        textBasic: string;
        textRepeatable: string[];
        textRepeatableAdvanced: string[];
        textInlineRepeatable: string[];
        pillButtons: string;
    }

    const values = $state<Values>({
        dropdownBasic: "detect",
        dropdownRich: "nord",
        booleanCheckbox: true,
        booleanSwitch: false,
        colorBasic: "#4f5a6f",
        colorPalette: ["#4f5a6f", "#f6f7fb", "#c0d0e0", "#a0b0c0", "#708090"],
        numberBasic: 42,
        numberWithUndefined: undefined,
        numberFractional: 1.4,
        rangeBasic: 42,
        rangeLabeled: 0.4,
        textBasic: "Hello, world!",
        textRepeatable: ["Item 1", "Item 2", "Item 3"],
        textRepeatableAdvanced: ["Value A", "Value B"],
        textInlineRepeatable: ["Inline 1", "Inline 2", "Inline 3", "Inline 4"],
        pillButtons: "default",
    });
</script>

<Page title="Component Showcase">

    <Group title="Booleans">
        <Item name="Checkbox" note="This is a checkbox.">
            <Checkbox bind:checked={values.booleanCheckbox} />
        </Item>
        <Separator />
        <Item name="Switch" note="This is a switch.">
            <Switch bind:checked={values.booleanSwitch} />
        </Item>
    </Group>


    <Group title="Colors">
        <Item name="Basic Color" note="This is a color input.">
            <Color bind:value={values.colorBasic} />
        </Item>
        <Separator />
        <Item name="Color Palette" note="This is a color palette input.">
            <Palette bind:value={values.colorPalette} defaultValue={["#4f5a6f", "#f6f7fb", "#c0d0e0", "#a0b0c0", "#708090"]} />
        </Item>
    </Group>


    <Group title="Dropdowns">
         <Item name="Basic" note="Default behavior with string options.">
            <Dropdown bind:value={values.dropdownBasic} options={basicOptions} />
        </Item>
        <Separator />
        <Item name="Structured options" note="Supports labels and separators between logical sections.">
            <Dropdown bind:value={values.dropdownRich} groups={richOptions} searchable allowEmpty placeholder="Select grouped option" />
        </Item>
    </Group>
    <Group>
        <LinkItem name="Advanced Dropdown Debug" href="/app/dropdown-debug" icon={CogIconUrl} />
    </Group>


    <Group title="Numbers">
        <Item name="Basic number" note="This is a number input.">
            <Number bind:value={values.numberBasic} min={0} max={100} step={1} />
        </Item>
        <Separator />
        <Item name="Number with undefined" note="Supports undefined value for 'no value' state.">
            <Number bind:value={values.numberWithUndefined} min={0} max={100} step={1} placeholder="No value" />
        </Item>
        <Separator />
        <Item name="Fractional number" note="Supports fractional values when step is non-integer.">
            <Number bind:value={values.numberFractional} min={0} max={10} step={0.1} integer={false} />
        </Item>
        <Separator />
        <Item name="Range input" note="This is a range input.">
            <Range bind:value={values.rangeBasic} min={0} max={100} step={1} showLabels={false} />
        </Item>
        <Separator />
        <Item name="Range with labels" note="Shows min/max labels when showLabels is true.">
            <Range bind:value={values.rangeLabeled} min={0} max={1} step={0.1} showLabels />
         </Item>
    </Group>

    <Group title="Text">
        <Item name="Basic text" note="This is a text input.">
            <Text bind:value={values.textBasic} placeholder="Enter text here" />
        </Item>
        <Separator />
        <Item name="Repeatable Text" note="This is a repeatable text input.">
            <RepeatableText bind:value={values.textRepeatable} />
        </Item>
        <Separator />
        <Item name="Repeatable Text Advanced" note="This is an advanced repeatable text input.">
            <RepeatableText bind:value={values.textRepeatableAdvanced} placeholder="Enter value" emptyLabel="No values set" maxPreview={3} canReorder={false} />
        </Item>
        <Separator />
        <Item name="Inline Repeatable Text" note="This is an inline repeatable text input.">
            <InlineRepeatableText bind:value={values.textInlineRepeatable} placeholder="Enter value" />
        </Item>
    </Group>

    <Group title="Pill Buttons">
        <Item name="Pill Buttons" note="This is a pill buttons input.">
            <PillButtons
                bind:value={values.pillButtons}
                options={[
                    {value: "default", label: "Default"},
                    {value: "true", label: "On", variant: "accent"},
                    {value: "false", label: "Off", variant: "danger"},
                ]}
            />
        </Item>
    </Group>

    <Group title="Live Values" borderless>
        <div class="preview">
            {#each Object.entries(values) as [k, v] (k)}
                <div><span>{k}</span><code>{v ?? "<empty>"}</code></div>
                <Separator />
            {/each}
        </div>
    </Group>
</Page>

<style>
    .preview {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        background: color-mix(in srgb, var(--bg-level-2) 85%, black);
        border-radius: var(--radius-level-3);
        padding: 12px;
        border: 1px solid var(--border-level-2);
    }

    .preview div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    .preview span {
        color: var(--font-color-muted);
        font-size: 0.85rem;
    }

    .preview code {
        background: var(--bg-level-3);
        border: 1px solid var(--border-level-3);
        border-radius: var(--radius-level-5);
        padding: 3px 8px;
    }
</style>
