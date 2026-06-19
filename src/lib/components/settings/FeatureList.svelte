<script lang="ts">
    import PillButtonGroup, {type PillOption} from "./PillButtons.svelte";

    // Should this be exported from a module like I did with PillButtons?
    // It's only used here for now, but it is a public API of sorts since
    // it's part of the value format.
    // TODO: ^^^^^^^^^^
    export interface Feature {
        id: string; // e.g. 'cursor', 'sudo'
        label: string; // e.g. 'Cursor', 'Sudo'
    }

    interface Props {
        value: string; // raw config string, e.g. 'cursor,no-sudo,title'
        features: Feature[];
        borderless?: boolean;
    }

    // eslint-disable-next-line prefer-const
    let {value = $bindable(), features, borderless = false}: Props = $props();

    type FeatureState = "default" | "on" | "off";

    const PILL_OPTIONS: PillOption[] = [
        {label: "Default", value: "default", variant: "neutral"},
        {label: "On", value: "on", variant: "accent"},
        {label: "Off", value: "off", variant: "danger"},
    ];

    function parse(raw: string): Record<string, FeatureState> {
        const result: Record<string, FeatureState> = {};
        for (const token of raw.split(",").map(t => t.trim()).filter(Boolean)) {
            if (token.startsWith("no-")) result[token.slice(3)] = "off";
            else result[token] = "on";
        }
        return result;
    }

    function serialize(states: Record<string, FeatureState>): string {
        return features
            .flatMap(f => {
                const s = states[f.id] ?? "default";
                if (s === "on") return [f.id];
                if (s === "off") return [`no-${f.id}`];
                return [];
            })
            .join(",");
    }


    const states = $derived.by(() => parse(value));

    function setState(id: string, next: string) {
        const updated = {...states, [id]: next as FeatureState};
        value = serialize(updated);
    }
</script>

<!-- TODO: should this use Group and Separator components? -->
<div class="feature-list" class:borderless>
    {#each features as feature (feature.id)}
        <div class="feature-row">
            <span class="feature-label">{feature.label}</span>
            <PillButtonGroup
                value={states[feature.id] ?? "default"}
                options={PILL_OPTIONS}
                onchange={(v: string) => setState(feature.id, v)}
            />
        </div>
        <!-- {#if i < features.length - 1}<Separator />{/if} -->
    {/each}
</div>


<style>
.feature-list {
    display: flex;
    flex-direction: column;
    background: var(--bg-level-2);
    border-radius: var(--radius-level-3);
    border: 1px solid var(--border-level-2);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
    overflow: hidden;
    flex: 1;
}

.feature-list.borderless {
    background: transparent;
    border: none;
    box-shadow: none;
}

.feature-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    gap: 12px;
}

.feature-list.borderless .feature-row {
    padding-left: 0;
    padding-right: 0;
}

.feature-row + .feature-row {
    border-top: 1px solid var(--bg-separator, rgba(255,255,255,0.07));
}

.feature-label {
    font-size: 0.9em;
    color: var(--font-color, #e0d9f0);
    flex: 1;
}
</style>
