<script lang="ts">
    import Button from "../Button.svelte";
    import FeatureListModal from "../modals/FeatureListModal.svelte";


    interface Feature {
        id: string; // e.g. 'cursor', 'sudo'
        label: string; // e.g. 'Cursor', 'Sudo'
        default: boolean; // whether the default state is on or off
    }

    interface Props {
        value: string;
        features: Feature[];
    };

    // eslint-disable-next-line prefer-const
    let {value = $bindable(), features}: Props = $props();

    let states = $derived.by(() => parse(value));

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

    // Modal stuff
    let isEditorOpen = $state(false);
    let draftState = $state<Record<string, boolean>>({});
    function openEditor() {
        draftState = {...states};
        isEditorOpen = true;
    }

    function closeEditor() {
        isEditorOpen = false;
        draftState = {};
    }

    function onEditorSave() {
        states = {...draftState};
        value = serialize(states);
        closeEditor();
    }

    function handleEditorKeydown(event: KeyboardEvent) {
        if (!isEditorOpen) return;
        if (event.key === "Escape") closeEditor();
    }
</script>

<Button onclick={openEditor}>
    Configure…
</Button>

<svelte:document onkeydown={handleEditorKeydown} />

{#if isEditorOpen}
    <FeatureListModal
        bind:draftState
        {features}
        onsave={onEditorSave}
        onclose={closeEditor}
    />
{/if}
