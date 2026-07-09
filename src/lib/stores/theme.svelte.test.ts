import {afterEach, describe, expect, it} from "vitest";
import themes from "$lib/data/themes";
import config, {defaults, diff, resetSetting} from "./config.svelte";
import {effectiveColors, preview, themeSelection} from "./theme.svelte";

// Two real themes with distinct, defined backgrounds, picked dynamically so the tests don't
// break when the generated themes data is re-synced.
const [nameA, schemeA] = Object.entries(themes).find(([, s]) => s.background && s.palette.length >= 16)!;
const [nameB, schemeB] = Object.entries(themes).find(([, s]) => s.background && s.background !== schemeA.background)!;

afterEach(() => {
    resetSetting("theme");
    resetSetting("background");
    resetSetting("palette");
    preview.mode = "dark";
});

describe("themeSelection", () => {
    it("follows config.theme", () => {
        expect(themeSelection().kind).toBe("unset");
        config.theme = nameA;
        expect(themeSelection()).toEqual({kind: "single", name: nameA});
        config.theme = `light:${nameA},dark:${nameB}`;
        expect(themeSelection().kind).toBe("dual");
    });
});

describe("effectiveColors", () => {
    it("returns app defaults when no theme is set", () => {
        expect(effectiveColors().background).toBe(defaults.background);
        expect(effectiveColors().palette[0]).toBe(defaults.palette[0]);
    });

    it("returns theme colors when a theme is active", () => {
        config.theme = nameA;
        expect(effectiveColors().background).toBe(schemeA.background);
        expect(effectiveColors().palette[0]).toBe(schemeA.palette[0]);
    });

    it("lets an explicit override beat the theme, and reset fall back to the theme", () => {
        config.theme = nameA;
        config.background = "#123456";
        expect(effectiveColors().background).toBe("#123456");
        resetSetting("background");
        expect(effectiveColors().background).toBe(schemeA.background);
    });

    it("overrides the palette element-wise", () => {
        config.theme = nameA;
        config.palette[3] = "#ff00ff";
        expect(effectiveColors().palette[3]).toBe("#ff00ff");
        expect(effectiveColors().palette[0]).toBe(schemeA.palette[0]);
    });

    it("resolves a dual theme through the preview mode", () => {
        config.theme = `light:${nameA},dark:${nameB}`;
        expect(effectiveColors().background).toBe(schemeB.background); // default preview: dark
        preview.mode = "light";
        expect(effectiveColors().background).toBe(schemeA.background);
    });

    it("falls back to defaults for an unknown/custom theme name", () => {
        config.theme = "Some Custom Theme That Does Not Exist";
        expect(effectiveColors().background).toBe(defaults.background);
    });
});

describe("no theme bleed in diff()", () => {
    it("selecting a theme emits only the theme key, never its colors", () => {
        config.theme = nameA;
        const output = diff();
        expect(output.theme).toBe(nameA);
        expect(output.background).toBeUndefined();
        expect(output.palette).toBeUndefined();
        expect(Object.keys(output)).toEqual(["theme"]);
    });

    it("a genuine override serializes alongside the theme", () => {
        config.theme = nameA;
        config.background = "#123456";
        expect(diff().background).toBe("#123456");
    });
});
