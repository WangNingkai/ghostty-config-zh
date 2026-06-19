<script lang="ts">
    import Button from "../Button.svelte";
    import RepeatableInputModal from "../modals/RepeatableInputModal.svelte";

    type Props = {
        value: string[];
        placeholder?: string;
        emptyLabel?: string;
        maxPreview?: number;
        canReorder?: boolean;
    };

    let {
        value = $bindable([]),
        placeholder = "New item", // eslint-disable-line prefer-const
        emptyLabel = "No values set", // eslint-disable-line prefer-const
        maxPreview = 1, // eslint-disable-line prefer-const
        canReorder = true, // eslint-disable-line prefer-const
    }: Props = $props();

    let isEditorOpen = $state(false);
    let draftValues = $state<string[]>([]);

    const normalizedValues = $derived(value.map(item => item.trim()).filter(item => item !== ""));
    const previewValues = $derived(normalizedValues.slice(0, maxPreview));
    const hiddenCount = $derived(Math.max(normalizedValues.length - previewValues.length, 0));

    function openEditor() {
        draftValues = [...value];
        isEditorOpen = true;
    }

    function closeEditor() {
        isEditorOpen = false;
        draftValues = [];
    }

    // function quickAdd() {
    //     openEditor();
    //     draftValues = [...draftValues, ""];
    // }

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
            {#if normalizedValues.length === 0}
                <span class="empty">{emptyLabel}</span>
            {:else}
                {#each previewValues as previewValue, index (`${previewValue}-${index}`)}
                    <span class="chip" title={previewValue}>{previewValue}</span>
                {/each}
                {#if hiddenCount > 0}
                    <span class="more">+{hiddenCount} more</span>
                {/if}
            {/if}
        </div>

        <div class="summary-actions">
            <!-- <button type="button" title="Add item" onclick={quickAdd} aria-label="Add item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 56 56">
                    <path d="M0 0h56v56H0z" fill="none" />
                    <path fill="currentColor" d="M27.988 47.734c1.149 0 2.11-.914 2.11-2.039V30.11h15.14c1.125 0 2.11-.96 2.11-2.109c0-1.148-.985-2.086-2.11-2.086h-15.14v-15.61c0-1.124-.961-2.038-2.11-2.038c-1.148 0-2.086.914-2.086 2.039v15.61h-15.14c-1.125 0-2.11.937-2.11 2.085s.985 2.11 2.11 2.11h15.14v15.585c0 1.125.938 2.04 2.086 2.04" />
                </svg>
            </button> -->
            <!-- <button type="button" onclick={openEditor} aria-label="Edit items">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 56 56">
                    <path d="M0 0h56v56H0z" fill="none" />
                    <path fill="currentColor" d="m43.293 16.926l2.367-2.32c1.196-1.196 1.242-2.485.188-3.563l-.797-.797c-1.055-1.055-2.344-.937-3.54.211l-2.367 2.344ZM15.66 44.488l25.57-25.547l-4.101-4.125l-25.594 25.57L9.31 45.59c-.211.562.375 1.219.937.984Z" />
                </svg>
            </button> -->
            <Button type="button" onclick={openEditor}>
                <!-- <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 56 56">
                    <path d="M0 0h56v56H0z" fill="none" />
                    <path fill="currentColor" d="m43.293 16.926l2.367-2.32c1.196-1.196 1.242-2.485.188-3.563l-.797-.797c-1.055-1.055-2.344-.937-3.54.211l-2.367 2.344ZM15.66 44.488l25.57-25.547l-4.101-4.125l-25.594 25.57L9.31 45.59c-.211.562.375 1.219.937.984Z" />
                </svg> -->
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
    /* background: var(--bg-level-2); */
    /* border: 1px solid var(--border-input); */
    /* border-radius: var(--radius-level-5); */
    /* min-height: 34px; */
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

.chip {
    display: inline-flex;
    align-items: center;
    max-width: 160px;
    padding: 2px 8px;
    /* border-radius: 999px; */
    /* background: var(--bg-level-4); */
    /* border: 1px solid var(--border-level-2); */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.chip {
    padding: 2px 6px;
    border-radius: var(--radius-level-4);
    background: rgba(from var(--bg-level-2) r g b / 0.6);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-level-1);
    box-shadow:
        0 0 1px -1px rgba(0,0,0,0.7),
        0 0 1px white inset;

    /* background: var(--bg-level-2); */
    /* border-radius: var(--radius-level-3); */
    /* border: 1px solid var(--border-level-2); */
    /* box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05) inset; */

    /* background: var(--bg-stepper); */
    /* background: var(--color-selected) */
}

.empty,
.more {
    color: var(--font-color-muted);
}

.summary-actions {
    display: flex;
    align-items: center;
    gap: 6px;
}

/* button {
    border: 1px solid transparent;
    border-radius: var(--radius-level-5);
    background: 0;
    color: inherit;
    height: 16px;
    width: 16px;
    padding: 0;
    color: var(--font-color-muted);
}

button:hover {
    color: var(--font-color);
    cursor: pointer;
}

button:disabled {
    opacity: 0.5;
} */
</style>