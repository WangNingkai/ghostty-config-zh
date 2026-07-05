<script lang="ts">
    import {SvelteSet} from "svelte/reactivity";

    interface DurationUnit {
        suffix: string;
        label: string;
        plural: string;
        ms: number;
    }

    interface ParsedSegment {
        value: number;
        unit: DurationUnit;
    }

    interface ParseResult {
        ok: boolean;
        segments: ParsedSegment[];
        error?: string;
    }

    interface Props {
        value: string;
        nullable?: boolean; // if true, empty string is valid (means "unset")
        placeholder?: string; // overrides default placeholder
        disabled?: boolean; // if true, disables the input
    }

    // eslint-disable-next-line prefer-const
    let {value = $bindable(""), nullable = false, placeholder = "", disabled = false}: Props = $props();

    // TODO: move somewhere else?
    const UNITS: DurationUnit[] = [
        {suffix: "ns", label: "Nanosecond", plural: "Nanoseconds", ms: 0.000001},
        {suffix: "us", label: "Microsecond", plural: "Microseconds", ms: 0.001},
        {suffix: "ms", label: "Millisecond", plural: "Milliseconds", ms: 1},
        {suffix: "s", label: "Second", plural: "Seconds", ms: 1000},
        {suffix: "m", label: "Minute", plural: "Minutes", ms: 60_000},
        {suffix: "h", label: "Hour", plural: "Hours", ms: 3_600_000},
        {suffix: "d", label: "Day", plural: "Days", ms: 86_400_000},
        {suffix: "y", label: "Year", plural: "Years", ms: 31_536_000_000},
    ];

    // Longest suffix first so 'ms' matches before 's', 'us' before 's', etc.
    const UNITS_BY_SUFFIX_DESC = [...UNITS].sort((a, b) => b.suffix.length - a.suffix.length);

    function parse(raw: string): ParseResult {
        const trimmed = raw.trim();
        if (trimmed === "") {
            return nullable
                ? {ok: true, segments: []}
                : {ok: false, segments: [], error: "Value is required"};
        }

        const segments: ParsedSegment[] = [];
        let remaining = trimmed;
        const seenUnits = new SvelteSet<string>();

        while (remaining.length > 0) {
            // Skip whitespace between segments
            remaining = remaining.trim();
            if (remaining.length === 0) break;

            // Must start with a positive integer
            const numMatch = remaining.match(/^(\d+)/);
            if (!numMatch) {
                return {
                    ok: false,
                    segments,
                    error: `Expected a number, got "${remaining}"`
                };
            }

            const num = parseInt(numMatch[1], 10);
            remaining = remaining.slice(numMatch[1].length);

            // Find the unit suffix
            const unit = UNITS_BY_SUFFIX_DESC.find(u => remaining.startsWith(u.suffix));
            if (!unit) {
                return {
                    ok: false,
                    segments,
                    error: remaining.length
                        ? `Unknown unit "${remaining}"`
                        : "Missing unit after number"
                };
            }

            if (seenUnits.has(unit.suffix)) {
                return {ok: false, segments, error: `Duplicate unit "${unit.suffix}"`};
            }

            seenUnits.add(unit.suffix);
            segments.push({value: num, unit});
            remaining = remaining.slice(unit.suffix.length);
        }

        if (segments.length === 0) {
            return {ok: false, segments, error: "Enter a duration"};
        }

        return {ok: true, segments};
    }

    function humanize(segments: ParsedSegment[]): string {
        if (segments.length === 0) return "";
        return segments
            .map(s => `${s.value} ${s.value === 1 ? s.unit.label : s.unit.plural}`)
            .join(", ");
    }


    // Internal input state tracks the bound `value` via a writable $derived: local edits override
    // it while typing, but it reverts to `value` whenever that changes from the outside
    // (reset-to-default, config import). We only push back to `value` once the input parses, so a
    // live preview/error can be shown for an invalid draft without mutating the bound value.
    let internalValue = $derived(value);
    const result = $derived(parse(internalValue));
    const preview = $derived(humanize(result.segments));
    const showError = $derived(!result.ok && internalValue !== "");
    const showPreview = $derived(result.ok && preview !== "");


    function onchange(next: string) {
        const nextResult = parse(next);
        if (nextResult.ok) value = next;
        internalValue = next;
    }
</script>

{#snippet label()}
{#if showError}
    <span class="feedback error-text">{result.error}</span>
{:else if showPreview}
    <span class="feedback preview-text">{preview}</span>
{/if}
{/snippet}


<div class="duration-wrap">
    <div class="input-row">
        {@render label()}
        <input
            class="duration-input"
            class:error={showError}
            type="text"
            bind:value={() => internalValue, onchange}
            placeholder={placeholder || (nullable ? "Default" : "e.g. 750ms")}
            spellcheck="false"
            autocomplete="off"
            size={Math.max(internalValue.length, 8) - 2}
            {disabled}
        />
        <!-- <span class="format-hint">y d h m s ms us ns</span> -->
    </div>
    <!-- {@render label()} -->
</div>


<style>
.duration-wrap {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-end;
    min-width: 180px;
}

.input-row {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    justify-content: flex-end;
}

.duration-input {
    background: var(--bg-level-2);
    border: 1px solid var(--border-input);
    border-radius: var(--radius-level-5);
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    outline: 3px solid transparent;
    /* padding: 2px 8px 3px; */
    padding: 0 4px 2px 0; /* This matches text component, but the other one feels better */
    text-align: right;
    transition: border-color 120ms, background-color 120ms;
}

.duration-input:focus {
    background: var(--bg-input-focus);
    outline: var(--border-input-focus);
}

.duration-input.error {
    outline-color: var(--color-danger)
}

.feedback {
    font-size: 0.8em;
    text-align: right;
    line-height: 1.3;
    min-height: 1.3em;
}

.preview-text {
    color: var(--font-color);
    opacity: 0.85;
}

.error-text {
    color: var(--color-danger);
}
</style>
