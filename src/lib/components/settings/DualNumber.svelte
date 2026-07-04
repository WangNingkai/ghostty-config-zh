<script lang="ts">
    import LinkedInput from "./LinkedInput.svelte";
    import Number from "./Number.svelte";

    interface Props {
        value: string; // '2' (linked) or '2,4' (unlinked)
        labels: [string, string]; // e.g. ['Left', 'Right'] or ['Top', 'Bottom']
        min?: number;
        max?: number;
        step?: number;
    }

    // eslint-disable-next-line prefer-const
    let {value = $bindable("0"), labels, min, max, step = 1}: Props = $props();

    function parse(raw: string) {
        const parts = raw.split(",").map(p => parseFloat(p.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            return {first: String(parts[0]), second: String(parts[1]), linked: false};
        }
        const single = parseFloat(raw);
        const v = isNaN(single) ? 0 : single;
        return {first: String(v), second: String(v), linked: true};
    }

    function serialize({first, second, linked}: {first: string; second: string; linked: boolean}): string {
        return linked ? first : `${first},${second}`;
    }
</script>

<LinkedInput bind:value {labels} {parse} {serialize}>
    {#snippet control(num: string, setNum: (next: string) => void)}
        <Number
            value={num === "" ? undefined : parseFloat(num)}
            size={2}
            {min}
            {max}
            {step}
            onchange={(n: number | undefined) => {
                if (n !== undefined) setNum(String(n));
            }}
        />
    {/snippet}
</LinkedInput>
