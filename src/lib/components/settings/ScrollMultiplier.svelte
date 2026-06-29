<script lang="ts">
    import DualNumber from "./DualNumber.svelte";

    interface Props { value: string; }
    let {value = $bindable("")}: Props = $props();

    function parse(raw: string): string {
        // translate scroll-multiplier's format into DualNumber's "a,b" or "a" format
        const trimmed = raw.trim();
        if (trimmed === "") return "3"; // default discrete=3, precision=1... see below
        if (!trimmed.includes(":")) return trimmed; // already bare/uniform
        let discrete = 3, precision = 1;
        for (const part of trimmed.split(",").map(p => p.trim())) {
            const [prefix, num] = part.split(":");
            const n = parseFloat(num);
            if (isNaN(n)) continue;
            if (prefix === "discrete") discrete = n;
            if (prefix === "precision") precision = n;
        }
        return `${precision},${discrete}`; // DualNumber's pair format
    }

    function serialize(dualValue: string): string {
        const parts = dualValue.split(",").map(p => parseFloat(p.trim()));
        if (parts.length === 1) return String(parts[0]); // uniform
        const [precision, discrete] = parts;
        return `precision:${precision},discrete:${discrete}`;
    }

    const dualValue = $derived(parse(value));

    function onChange(next: string) {
        value = serialize(next);
    }
</script>


<DualNumber bind:value={() => dualValue, onChange} labels={["Precision", "Discrete"]} min={0.01} max={10000} step={0.1} />