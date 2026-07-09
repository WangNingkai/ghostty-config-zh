import {afterEach, describe, expect, it} from "vitest";
import config, {defaults, diff, diffFromDefaults, isNonDefault, load, resetSetting} from "./config.svelte";
import {serialize} from "$lib/utils/parse";

// These lock in the flat-string store contract: every value is a string | string[], and
// diff()/load() compare/merge them as such (see the Phase A+B flatten). There was no coverage
// guarding this serialization source of truth before, so this doubles as regression protection.

afterEach(() => {
    // config is a module singleton; reset anything a test touched
    for (const k of ["fontSize", "desktopNotifications", "fontFamily", "windowWidth", "background"] as const) {
        resetSetting(k);
    }
});

describe("flat store defaults", () => {
    it("holds strings for former number/boolean settings", () => {
        expect(defaults.fontSize).toBe("13");
        expect(defaults.desktopNotifications).toBe("true");
        expect(defaults.windowWidth).toBe(""); // was `undefined`
        expect(typeof config.fontSize).toBe("string");
    });

    it("holds string[] for repeatable settings", () => {
        expect(Array.isArray(defaults.fontFamily)).toBe(true);
        expect(Array.isArray(defaults.palette)).toBe(true);
    });
});

describe("diff()", () => {
    it("omits values equal to their (string) default", () => {
        expect(diff()["font-size"]).toBeUndefined();
        expect(isNonDefault("fontSize")).toBe(false);
    });

    it("emits a changed scalar as a string", () => {
        config.fontSize = "16";
        expect(diff()["font-size"]).toBe("16");
        expect(isNonDefault("fontSize")).toBe(true);
    });

    it("emits a changed boolean-encoded scalar as a string", () => {
        config.desktopNotifications = "false";
        expect(diff()["desktop-notifications"]).toBe("false");
    });

    it("emits a changed repeatable setting as a string array", () => {
        config.fontFamily = ["JetBrainsMono NF", "Symbols Nerd Font"];
        expect(diff()["font-family"]).toEqual(["JetBrainsMono NF", "Symbols Nerd Font"]);
    });
});

describe("load()", () => {
    it("merges parsed string values through as-is", () => {
        load({fontSize: "20", background: "#123456"});
        expect(config.fontSize).toBe("20");
        expect(config.background).toBe("#123456");
    });
});

describe("round-trip diff -> serialize", () => {
    it("renders a flat diff as Ghostty config lines", () => {
        config.fontSize = "18";
        config.desktopNotifications = "false";
        const text = serialize(diff() as Record<string, string | string[]>, false);
        expect(text).toContain("font-size = 18");
        expect(text).toContain("desktop-notifications = false");
    });

    it("diffFromDefaults matches diff for the same change", () => {
        config.fontSize = "22";
        expect(diffFromDefaults({fontSize: "22"})["font-size"]).toBe("22");
    });
});
