<script lang="ts">
    import {dualThemeCodec, type LinkedValue} from "$lib/settings/codecs";
    import Dropdown from "./Dropdown.svelte";
    import LinkedInput from "./LinkedInput.svelte";

    interface Props {
        value: string; // 'Theme Name' (one theme) or 'light:Name,dark:Name' (per light/dark)
        options: Array<string | {name: string, value: string, icon?: string}>;
    }

    // eslint-disable-next-line prefer-const
    let {value = $bindable(""), options}: Props = $props();
</script>

<LinkedInput bind:value labels={["Light", "Dark"]} parse={(raw: string) => dualThemeCodec.parse(raw)} serialize={(v: LinkedValue) => dualThemeCodec.serialize(v)}>
    {#snippet control(theme: string, setTheme: (next: string) => void)}
        <Dropdown
            value={theme}
            {options}
            change={setTheme}
            placeholder="Choose a theme"
            searchable
            allowEmpty
            emptyLabel="Reset Theme"
            iconSize={32}
        />
    {/snippet}
</LinkedInput>
