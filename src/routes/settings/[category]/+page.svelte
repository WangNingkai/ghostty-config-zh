<script lang="ts">
    import Page from "$lib/views/Page.svelte";

    import {page} from "$app/stores";
    import Switch from "$lib/components/settings/Switch.svelte";
    import Item from "$lib/components/settings/Item.svelte";
    import Group from "$lib/components/settings/Group.svelte";
    import Separator from "$lib/components/settings/Separator.svelte";

    import registry from "$lib/settings/registry";
    import navigation from "$lib/settings/navigation";
    import config, {isNonDefault, resetSetting} from "$lib/stores/config.svelte";
    import Text from "$lib/components/settings/Text.svelte";
    import Number from "$lib/components/settings/Number.svelte";
    import Dropdown from "$lib/components/settings/Dropdown.svelte";
    import Color from "$lib/components/settings/Color.svelte";
    import Palette from "$lib/components/settings/Palette.svelte";
    import Admonition from "$lib/components/Admonition.svelte";
    import Theme from "$lib/components/settings/Theme.svelte";
    import {previews} from "./previews";
    import type {Component} from "svelte";
    import type {HexColor} from "$lib/utils/colors";
    import {resolve} from "$app/paths";
    import {success} from "$lib/stores/toasts.svelte";
    import Range from "$lib/components/settings/Range.svelte";
    import RepeatableText from "$lib/components/settings/RepeatableText.svelte";
    import FeatureList from "$lib/components/settings/FeatureList.svelte";
    import PillButtons from "$lib/components/settings/PillButtons.svelte";
    import Duration from "$lib/components/settings/Duration.svelte";
    import DualNumber from "$lib/components/settings/DualNumber.svelte";
    import CustomColor from "$lib/components/settings/CustomColor.svelte";
    import CustomNumber from "$lib/components/settings/CustomNumber.svelte";
    import ScrollMultiplier from "$lib/components/settings/ScrollMultiplier.svelte";
    import NumberWithUnits from "$lib/components/settings/NumberWithUnits.svelte";
    import {type DropdownOption, type FeatureDef, type PillOption, type SettingsRegistry, type SpecialValue} from "$lib/settings/types";


    const category = $derived(navigation.find(c => c.id === $page.params.category));
    const title = $derived(category?.name ?? $page.params.category);
</script>


<Page {title}>
    {#if category}
        {#if category.id === "fonts"}
            <Admonition size="1.5rem">The font playground has moved to a <a href={resolve("/app/font-playground")}>separate page</a>.</Admonition>
        {:else if category.id === "colors"}
            <Admonition size="1.5rem">You can reset a color to its default value by right clicking!</Admonition>
        {/if}
        {#each category.groups as group (group.id)}
            <Group title={group.name} note={"note" in group ? group.note : undefined}>
                {@const previewKey = "preview" in group ? group.preview : undefined}
                {#if previewKey && previews[previewKey]}
                    {@const Preview = previews[previewKey] as Component}
                    <Preview />
                    <Separator />
                {/if}
                {#each group.settings as settingId, i (i)}
                    {@const setting = registry[settingId] as SettingsRegistry[keyof SettingsRegistry]}
                    {@const widget = setting.widget}
                    {#if i !== 0}<Separator />{/if}
                    <Item
                        {settingId}
                        name={setting.name}
                        note={setting.note}
                        // filter out the current platform from the badge list since it's already obvious from the UI
                        platform={setting?.platform?.filter(p => p !== title?.toLowerCase())}
                        since={setting.since}
                        description={widget?.type === "palette" ? undefined : setting.description}
                        isNonDefault={isNonDefault(settingId)}
                        onReset={() => {
                            resetSetting(settingId);
                            success(`${setting.name} reset to default`);
                        }}
                    >
                        {#if widget}
                            {#if widget.type === "switch"}
                                <Switch bind:value={config[settingId] as string} />
                            {:else if widget.type === "text"}
                                <Text bind:value={config[settingId] as string} placeholder={widget.placeholder} size={widget.size} />
                            {:else if widget.type === "range"}
                                <Range bind:value={config[settingId] as string} min={widget.min} max={widget.max} step={widget.step} showLabels={widget.showLabels} />
                            {:else if widget.type === "number"}
                                <Number bind:value={config[settingId] as string} min={widget.min} max={widget.max} step={widget.step} size={widget.size} placeholder={widget.placeholder} integer={widget.integer} />
                            {:else if widget.type === "dropdown"}
                                <Dropdown bind:value={config[settingId] as string} options={widget.options as Array<DropdownOption | string>} placeholder={widget.placeholder} allowEmpty={widget.allowEmpty} emptyLabel={widget.emptyLabel} disabled={setting.disabled} />
                            {:else if widget.type === "theme"}
                                <Theme bind:value={config[settingId] as string} options={widget.options as Array<DropdownOption | string>} />
                            {:else if widget.type === "color"}
                                <Color defaultValue={setting.default as HexColor} bind:value={config[settingId] as HexColor} />
                            {:else if widget.type === "palette"}
                                <Palette defaultValue={setting.default as HexColor[]} bind:value={config[settingId] as HexColor[]} />
                            {:else if widget.type === "repeatable-text"}
                                <RepeatableText bind:value={config[settingId] as string[]} placeholder={widget.placeholder} canReorder={widget.canReorder} />
                            {:else if widget.type === "feature-list"}
                                <FeatureList bind:value={config[settingId] as string} features={widget.features as FeatureDef[]} />
                            {:else if widget.type === "pill"}
                                <PillButtons bind:value={config[settingId] as string} options={widget.options as PillOption[]} />
                            {:else if widget.type === "duration"}
                                <Duration bind:value={config[settingId] as string} nullable={widget.allowEmpty} placeholder={widget.placeholder} />
                            {:else if widget.type === "dual-number"}
                                <DualNumber bind:value={config[settingId] as string} labels={widget.labels as [string, string]} min={widget.min} max={widget.max} step={widget.step} />
                            {:else if widget.type === "custom-color"}
                                <CustomColor bind:value={config[settingId] as string} presets={widget.presets as SpecialValue[]} widget={widget.widget} default={setting.default as HexColor} />
                            {:else if widget.type === "custom-number"}
                                <CustomNumber bind:value={config[settingId] as string} presets={widget.presets as SpecialValue[]} min={widget.min} max={widget.max} step={widget.step} size={widget.size} placeholder={widget.placeholder} integer={widget.integer} widget={widget.widget} />
                            {:else if widget.type === "scroll-multiplier"}
                                <ScrollMultiplier bind:value={config[settingId] as string} />
                            {:else if widget.type === "number-units"}
                                <NumberWithUnits bind:value={config[settingId] as string} />
                            {/if}
                        <!-- Bare nav entries carry no widget: default to RepeatableText when the setting is
                             string[]-valued (`repeatable`), otherwise a plain Text input. -->
                        {:else if setting.repeatable}
                            <RepeatableText bind:value={config[settingId] as string[]} />
                        {:else}
                            <Text bind:value={config[settingId] as string} />
                        {/if}
                    </Item>
                {/each}
            </Group>
        {/each}
    {:else}
        <h1>What Happened?</h1>
        <p>You shouldn't be here! If you followed a link, please report the bug on GitHub. Otherwise, go ahead and start browsing on the left.</p>
    {/if}
</Page>