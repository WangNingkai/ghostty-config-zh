<script lang="ts">
    import Dropdown from "./Dropdown.svelte";
    import LinkedInput from "./LinkedInput.svelte";

    interface Props {
        value: string; // 'Theme Name' (one theme) or 'light:Name,dark:Name' (per light/dark)
        options: Array<string | {name: string, value: string, icon?: string}>;
    }

    // eslint-disable-next-line prefer-const
    let {value = $bindable(""), options}: Props = $props();

    // Ghostty accepts a single theme ("Name") or a per-mode pair ("light:Name,dark:Name").
    // Whitespace is trimmed and light/dark order does not matter; both must be present for the pair form.
    function parse(raw: string) {
        const trimmed = raw.trim();
        let light: string | undefined;
        let dark: string | undefined;

        for (const part of trimmed.split(",")) {
            const match = part.match(/^\s*(light|dark)\s*:(.*)$/i);
            if (!match) continue;
            if (match[1].toLowerCase() === "light") light = match[2].trim();
            else dark = match[2].trim();
        }

        // Only treat it as a pair when both modes are specified, per the docs
        if (light !== undefined && dark !== undefined) {
            return {first: light, second: dark, linked: false};
        }
        return {first: trimmed, second: trimmed, linked: true};
    }

    function serialize({first, second, linked}: {first: string; second: string; linked: boolean}): string {
        return linked ? first : `light:${first},dark:${second}`;
    }
</script>

<LinkedInput bind:value labels={["Light", "Dark"]} {parse} {serialize}>
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
