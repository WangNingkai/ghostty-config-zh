<script lang="ts">
    import {tooltip} from "$lib/actions/tooltip.svelte";
    import Number from "./Number.svelte";

    interface Props {
        value: string; // '2' or '2,4'
        labels: [string, string]; // e.g. ['Left', 'Right'] or ['Top', 'Bottom']
        min?: number;
        max?: number;
        step?: number;
    }

    // eslint-disable-next-line prefer-const
    let {value = $bindable("0"), labels, min, max, step = 1}: Props = $props();


    function parse(raw: string): [number, number, boolean] {
        const parts = raw.split(",").map(p => parseFloat(p.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            return [parts[0], parts[1], false]; // unlinked
        }
        const single = parseFloat(raw);
        const v = isNaN(single) ? 0 : single;
        return [v, v, true]; // linked
    }

    function serialize(): string {
        return linked ? String(firstNumber) : `${firstNumber},${secondNumber}`;
    }


    // TODO: consider using this technique over IIFEs elsewhere for init
    const [initA, initB, initLinked] = parse(value);
    let firstNumber = $state(initA);
    let secondNumber = $state(initB);
    let linked = $state(initLinked);

    function onChangeNumber(which: "first" | "second", next: number | undefined) {
        if (next === undefined) return; // ignore invalid input

        // If linked, both numbers get the same value regardless of which input changed
        if (linked) {
            firstNumber = next;
            secondNumber = next;
        }
        // Otherwise, only the changed input updates
        else {
            if (which === "first") firstNumber = next;
            else secondNumber = next;
        }

        value = serialize();
    }

    function toggleLink() {
        if (linked) secondNumber = firstNumber; // Going to unlink: both get current single value
        else secondNumber = firstNumber; // Going to re-link: first value wins
        linked = !linked;
        value = serialize();
    }
</script>

<div class="dual-number">
    <!-- First input -->
    <div class="field">
        <!-- {#if !linked} -->
            <span class="field-label">{labels[0]}</span>
        <!-- {/if} -->
        <Number
            value={firstNumber}
            size={2}
            {min}
            {max}
            {step}
            onchange={(next: number | undefined) => onChangeNumber("first", next)}
        />
    </div>

    <!-- Link toggle -->
    <button
        type="button"
        class="link-btn"
        class:linked
        onclick={toggleLink}
        aria-label={linked ? "Unlink values" : "Link values"}
        title={linked ? `Unlink ${labels[0]} and ${labels[1]}` : `Link ${labels[0]} and ${labels[1]}`}
        use:tooltip={{text: linked ? `Unlink ${labels[0]} and ${labels[1]}` : `Link ${labels[0]} and ${labels[1]}`}}
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56">
            <path d="M0 0h56v56H0z" fill="none" />
            <path fill="currentColor" d="m27.707 37.656l3.117-3.164c-3.093-.234-5.109-1.172-6.632-2.695c-4.102-4.102-4.079-9.914-.024-13.969l7.64-7.64c4.102-4.079 9.868-4.102 13.946 0c4.125 4.101 4.078 9.89.024 13.945l-4.594 4.594c.656 1.5.797 3.234.562 4.757l6.867-6.867c5.626-5.625 5.672-13.57-.023-19.265s-13.64-5.649-19.266-.024l-7.992 8.016c-5.625 5.625-5.672 13.594.024 19.265c1.476 1.477 3.351 2.532 6.351 3.047m.586-19.312l-3.117 3.164c3.094.258 5.11 1.172 6.633 2.695c4.101 4.102 4.078 9.914.023 13.969l-7.664 7.64c-4.078 4.079-9.867 4.102-13.945.024c-4.102-4.125-4.078-9.89 0-13.969l4.593-4.594c-.656-1.476-.82-3.234-.585-4.757l-6.868 6.867c-5.601 5.625-5.648 13.594.024 19.265c5.695 5.696 13.664 5.649 19.266.047l8.015-8.039c5.625-5.625 5.672-13.593-.023-19.265c-1.477-1.477-3.352-2.532-6.352-3.047" />
        </svg>
        <!-- TODO: cant decide between these -->
        <!-- {#if linked}
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56">
                <path d="M0 0h56v56H0z" fill="none" />
                <path fill="currentColor" d="M28 51.906c13.055 0 23.906-10.851 23.906-23.906c0-13.078-10.875-23.906-23.93-23.906C14.899 4.094 4.095 14.922 4.095 28c0 13.055 10.828 23.906 23.906 23.906m10.406-34.804c2.906 2.882 2.649 6.445-.703 9.773l-4.031 4.055c.328-1.125.305-2.438-.07-3.328l2.367-2.368c2.297-2.25 2.554-4.617.726-6.422c-1.804-1.78-4.172-1.5-6.422.75l-3.351 3.305c-2.32 2.344-2.625 4.735-.797 6.516c.539.562 1.336.914 2.367 1.101c-.352.75-1.078 1.618-1.758 2.086c-.703-.117-1.594-.68-2.344-1.453c-2.906-2.883-2.601-6.492.797-9.914l3.422-3.398c3.352-3.352 6.914-3.586 9.797-.703M16.75 38.758c-2.906-2.883-2.649-6.446.727-9.774l4.03-4.054c-.35 1.125-.327 2.437.048 3.328l-2.368 2.367c-2.297 2.227-2.554 4.617-.726 6.422c1.805 1.781 4.195 1.5 6.422-.75l3.351-3.305c2.32-2.344 2.625-4.734.797-6.515c-.539-.563-1.336-.915-2.367-1.102c.351-.75 1.078-1.617 1.758-2.086c.703.117 1.593.68 2.367 1.453c2.883 2.883 2.578 6.469-.82 9.89l-3.422 3.423c-3.352 3.351-6.914 3.586-9.797.703" />
            </svg>
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56">
                <path d="M0 0h56v56H0z" fill="none" />
                <path fill="currentColor" d="M28 51.906c13.055 0 23.906-10.828 23.906-23.906c0-13.055-10.875-23.906-23.93-23.906C14.899 4.094 4.095 14.945 4.095 28c0 13.078 10.828 23.906 23.906 23.906m0-3.984C16.937 47.922 8.1 39.062 8.1 28c0-11.04 8.813-19.922 19.876-19.922c11.039 0 19.921 8.883 19.945 19.922c.023 11.063-8.883 19.922-19.922 19.922m10.078-30.469c-2.789-2.765-6.258-2.531-9.492.703l-3.328 3.328c-3.305 3.282-3.586 6.774-.774 9.563c.774.797 1.64 1.312 2.274 1.43c.633-.446 1.383-1.266 1.71-2.016q-1.51-.246-2.32-1.055c-1.734-1.758-1.476-4.078.82-6.328l3.212-3.234c2.18-2.18 4.5-2.438 6.234-.703c1.758 1.734 1.547 4.054-.68 6.234l-2.32 2.297c.352.844.375 2.133.023 3.234l3.985-3.937c3.21-3.258 3.469-6.703.656-9.516m-21 21.047c2.79 2.766 6.258 2.531 9.492-.703l3.328-3.328c3.305-3.282 3.586-6.774.774-9.563c-.774-.797-1.64-1.312-2.274-1.43c-.633.446-1.383 1.266-1.71 2.016q1.51.246 2.32 1.055c1.734 1.758 1.476 4.055-.82 6.305l-3.211 3.257c-2.18 2.18-4.5 2.438-6.235.703c-1.758-1.734-1.547-4.054.68-6.234l2.32-2.297c-.352-.867-.375-2.133-.023-3.234l-3.985 3.937c-3.21 3.258-3.469 6.703-.656 9.516" />
            </svg>
        {/if} -->
    </button>

    <!-- Second input (only shown when unlinked) -->
    <!-- {#if !linked} -->
    <div class="field">
        <span class="field-label">{labels[1]}</span>
        <Number
            value={secondNumber}
            size={2}
            {min}
            {max}
            {step}
            onchange={(next: number | undefined) => onChangeNumber("second", next)}
        />
    </div>
    <!-- {/if} -->
</div>

<style>
.dual-number {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.field {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
}

.field-label {
    font-size: 0.72em;
    color: var(--font-color-muted);
    user-select: none;
    line-height: 1;
    padding-right: 2px;
}


.link-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--font-color-muted);
    cursor: pointer;
    flex-shrink: 0;
    transition: background 120ms, color 120ms, border-color 120ms;
    /* nudge down to optically align with inputs when labels are showing */
    margin-top: 12px;
}

.link-btn svg {
    width: 16px;
    height: 16px;
}

.link-btn:hover {
    color: var(--font-color);
}

.link-btn.linked {
    border-color: var(--font-color-accent);
    color: var(--font-color-accent);
    /* color: var(--bg-level-2); */
    /* background: var(--font-color-accent); */
}

.link-btn.linked:hover {
    color: hsl(from var(--font-color-accent) h s calc(l + 15));
}

.link-btn:focus-visible {
    outline: var(--font-color-accent);
}
</style>
