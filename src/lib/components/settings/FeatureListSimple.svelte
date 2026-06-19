<script lang="ts">
    import {createTooltipAttachment} from "$lib/attachments/tooltip";
    import Switch from "./Switch.svelte";


    // Should this be exported from a module like I did with PillButtons?
    // It's only used here for now, but it is a public API of sorts since
    // it's part of the value format.
    // TODO: ^^^^^^^^^^
    export interface Feature {
        id: string; // e.g. 'cursor', 'sudo'
        label: string; // e.g. 'Cursor', 'Sudo'
        default: boolean; // whether the default state is on or off
    }

    interface Props {
        value: string; // raw config string, e.g. 'cursor,no-sudo,title'
        features: Feature[];
        borderless?: boolean;
    }

    // eslint-disable-next-line prefer-const
    let {value = $bindable(), features, borderless = false}: Props = $props();

    function parse(raw: string): Record<string, boolean> {
        const result: Record<string, boolean> = {};
        for (const f of features) result[f.id] = f.default;
        for (const token of raw.split(",").map(t => t.trim()).filter(Boolean)) {
            const isNegation = token.startsWith("no-");
            const id = isNegation ? token.slice(3) : token;
            if (!(id in result)) continue; // ignore unknown features
            if (isNegation) result[id] = false;
            else result[id] = true;
        }
        return result;
    }

    function serialize(current: Record<string, boolean>): string {
        return features
            .filter(f => current[f.id] !== f.default) // only emit overrides
            .map(f => current[f.id] ? f.id : `no-${f.id}`)
            .join(",");
    }


    const states = $derived.by(() => parse(value));

    function setState(id: string, next: boolean) {
        const updated = {...states, [id]: next};
        value = serialize(updated);
    }

    const tooltipAttachment = createTooltipAttachment("Reset to default");
</script>

<!-- TODO: should this use Group and Separator components? -->
<div class="feature-list" class:borderless>
    {#each features as feature (feature.id)}
        <div class="feature-row">
            <div class="feature-label">
                {feature.label}
                {#if states[feature.id] !== feature.default}
                        <button
                            class="reset-button"
                            onclick={() => setState(feature.id, feature.default)}
                            title="Reset to default"
                            type="button"
                            {@attach tooltipAttachment}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56">
                                <path d="M0 0h56v56H0z" fill="none" />
                                <path fill="currentColor" stroke="currentColor" stroke-width="2.5" paint-order="stroke" d="M50.148 34.914c0-8.953-6.046-15.14-16.757-15.14H17.664l-5.508.257l4.454-3.797l6.75-6.609c.374-.375.562-.82.562-1.43c0-1.218-.82-2.062-2.062-2.062c-.516 0-1.126.258-1.524.656L6.555 20.312c-.469.446-.703.985-.703 1.57c0 .563.234 1.102.703 1.548l13.781 13.523a2.2 2.2 0 0 0 1.524.656c1.242 0 2.062-.843 2.062-2.062c0-.61-.188-1.055-.562-1.43l-6.75-6.586l-4.454-3.797l5.508.235h16.078c7.992 0 12.235 4.406 12.235 10.71c0 6.329-4.243 11.016-12.235 11.016h-5.39c-1.29 0-2.133.938-2.133 2.086c0 1.149.844 2.086 2.133 2.086h5.414c10.5 0 16.382-5.976 16.382-14.953" />
                            </svg>

                        </button>
                    {/if}
            </div>
            <Switch
                checked={states[feature.id] ?? feature.default}
                onchange={(v: boolean) => setState(feature.id, v)}
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
    display: flex;
    align-items: center;
    gap: 6px;
}

.reset-button {
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-level-5);
    color: var(--font-color-muted);
    transition: all 150ms cubic-bezier(0.2, 0, 0.38, 0.9);
    outline: none;
}

.reset-button:focus-visible {
    outline: var(--border-input-focus);
}

.reset-button:hover {
    background-color: var(--bg-level-2);
    color: var(--font-color);
}

.reset-button:active {
    transform: scale(0.95);
}

.reset-button svg {
    width: 14px;
    height: 14px;
}
</style>
