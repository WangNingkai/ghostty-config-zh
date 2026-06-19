<script lang="ts">
    import Button from "../Button.svelte";
    import RepeatableInputModal from "../modals/RepeatableInputModal.svelte";
    import Text from "./Text.svelte";

    type Props = {
        value: string[];
        placeholder?: string;
        canReorder?: boolean;
    };

    let {
        value = $bindable([]),
        placeholder = "New item", // eslint-disable-line prefer-const
        canReorder = true, // eslint-disable-line prefer-const
    }: Props = $props();

    let isEditorOpen = $state(false);
    let draftValues = $state<string[]>([]);

    const normalizedValues = $derived(value.map(item => item.trim()).filter(item => item !== ""));
    const hiddenCount = $derived(Math.max(normalizedValues.length - 1, 0));

    function openEditor() {
        draftValues = [...value];
        isEditorOpen = true;
    }

    function closeEditor() {
        isEditorOpen = false;
        draftValues = [];
    }

    function onEditorSave() {
        const cleaned = draftValues.map(item => item.trim()).filter(item => item !== "");
        value = cleaned;
        closeEditor();
    }

    function handleEditorKeydown(event: KeyboardEvent) {
        if (!isEditorOpen) return;
        if (event.key === "Escape") closeEditor();
    }

    $effect(() => {
        if (draftValues.length !== 0) return;
        draftValues = [""];
    });
</script>

<div class="repeatable-setting">
    <div class="summary-row">
        <div class="preview" aria-live="polite">
            <Text bind:value={value[0]} {placeholder} size={15} />
            {#if hiddenCount > 0}
                <span class="more">+{hiddenCount} more</span>
            {/if}
        </div>

        <div class="summary-actions">
            <Button type="button" onclick={openEditor}>
                Edit…
            </Button>
        </div>
    </div>
</div>

<svelte:document onkeydown={handleEditorKeydown} />

{#if isEditorOpen}
    <RepeatableInputModal
        bind:draftValues
        onsave={onEditorSave}
        {placeholder}
        {canReorder}
        onclose={closeEditor}
    />
{/if}

<style>
.repeatable-setting {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 380px;
}

.summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 1px 4px 1px 4px;
    font-size: 0.875rem;
}

.preview {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    overflow: hidden;
}

.more {
    color: var(--font-color-muted);
}

.summary-actions {
    display: flex;
    align-items: center;
    gap: 6px;
}
</style>