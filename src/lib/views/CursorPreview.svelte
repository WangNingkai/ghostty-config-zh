<script lang="ts">
    import {numberCodec} from "$lib/settings/codecs";
    import config from "$lib/stores/config.svelte";
    import {resolveCellColor} from "$lib/utils/colors";
    import {onMount} from "svelte";

    let isCursorVisible = $state(true);

    onMount(() => {
        const interval = setInterval(() => {
            if (config.cursorStyleBlink !== "false") isCursorVisible = !isCursorVisible;
            else isCursorVisible = true;
        }, 1000);
        return () => clearInterval(interval);
    });

    // TODO: make less gross with less ternaries
    // cursorColor/cursorText may be `cell-foreground`/`cell-background` keywords; resolve them.
    const cursorColor = $derived(resolveCellColor(config.cursorColor, config.foreground, config.background) || config.foreground);
    const cursorText = $derived(isCursorVisible ? resolveCellColor(config.cursorText, config.foreground, config.background) || config.background : config.foreground);
    // Unset/unparseable opacity falls back to Ghostty's default of 1; a genuine "0" must stay 0.
    const cursorOpacity = $derived(isCursorVisible ? Math.round((numberCodec.parse(config.cursorOpacity) ?? 1) * 255).toString(16) : "00");
</script>

<div class="preview">
    <div class="row prompt">
        <span style:color="var(--config-palette-2)">john</span>
        <span style:color="var(--config-palette-6)">@</span>
        <span style:color="var(--config-palette-4)">doe-pc</span>
        <span style:color="var(--config-palette-1)" style:font-weight="700">$</span>
        git commit -m "<span class="cursor {config.cursorStyle}" style:color={cursorText} style:border-color="{cursorColor}{cursorOpacity}" style:background-color="{cursorColor}{cursorOpacity}">"</span>
    </div>
</div>

<style>
.preview {
    background: var(--config-bg);
    font-family: var(--config-font-family);
    font-size: var(--config-font-size);
    color: var(--config-fg);
    max-height: 60px;
    overflow-y: auto;
    padding: 8px;
    border-radius: var(--radius-level-3);
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5) inset;
}

.preview .row,
.prompt {
    display: flex;
    white-space: pre;
}

.cursor {
    margin-left: 1px;
}

.cursor.bar,
.cursor.underline,
.cursor.block_hollow {
    background-color: transparent!important;
    color: inherit !important;
}

.cursor.bar {
    border-left: 1px solid transparent;
    margin-left: 0;
}

.cursor.underline {
    border-bottom: 1px solid transparent;
}

.cursor.block_hollow {
    border: 1px solid transparent;
    margin-top: -1px;
    margin-left: 0;
}
</style>