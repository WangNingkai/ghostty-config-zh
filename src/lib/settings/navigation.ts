import application from "$lib/images/tabs/application.webp";
import terminal from "$lib/images/tabs/terminal.webp"; // placeholder
import clipboard from "$lib/images/tabs/clipboard.webp";
import window from "$lib/images/tabs/window.webp";

import colors from "$lib/images/tabs/colors.webp";
import fonts from "$lib/images/tabs/fonts.webp";

import keybinds from "$lib/images/tabs/keybinds.webp";
import mouse from "$lib/images/tabs/mouse.webp";

import gtk from "$lib/images/tabs/gtk.svg";
import linux from "$lib/images/tabs/linux.webp";
import macos from "$lib/images/tabs/macos.webp";

import {registry} from "./registry";
import type {PreviewKey, WidgetDef} from "./types";
import {dev} from "$app/environment";

/* eslint quote-props: ["error", "consistent-as-needed", {"keywords": false}] */

// A setting reference in a nav group: either a bare key (widget falls back to the registry
// `type` while refactoring) or an explicit widget override.
interface NavSetting {
    id: keyof typeof registry;
    widget?: WidgetDef;
}

interface NavGroup {
    id: string;
    name: string;
    note?: string;
    // Key into the renderer-side `previews` map. A string-union type (not a `Component` ref),
    // so navigation.ts stays pure data while the key stays checked against the map.
    preview?: PreviewKey;
    settings: Array<keyof typeof registry | NavSetting>;
}

interface NavPanel {
    id: string;
    icon: string;
    name: string;
    note?: string;
    groups?: NavGroup[];
    pages?: NavPanel[];
}

export const navigation = [
    {
        id: "application",
        icon: application,
        name: "Application",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    "title",
                    {id: "desktopNotifications", widget: {type: "switch"}},
                    {id: "configFile", widget: {type: "repeatable-text", placeholder: "path/to/config"}},
                    {id: "configDefaultFiles", widget: {type: "switch"}},
                    "link",
                    {id: "linkUrl", widget: {type: "switch"}},
                    {id: "linkPreviews", widget: {type: "pill", options: [{value: "true", label: "On"}, {value: "false", label: "Off"}, {value: "osc8", label: "OSC 8"}]}},
                    {id: "undoTimeout", widget: {type: "duration", allowEmpty: false}}
                ]
            },
            {
                id: "bell",
                name: "Bell",
                settings: [
                    {id: "bellFeatures", widget: {type: "feature-list", features: [{id: "system", label: "System", default: false}, {id: "audio", label: "Audio", default: false}, {id: "attention", label: "Attention", default: true}, {id: "title", label: "Title", default: true}, {id: "border", label: "Border", default: false}]}},
                    "bellAudioPath",
                    {id: "bellAudioVolume", widget: {type: "range", min: 0, max: 1, step: 0.05, showLabels: false}}
                ]
            },
            {
                id: "startup",
                name: "Startup",
                settings: [
                    "command",
                    "initialCommand",
                    {id: "env", widget: {type: "repeatable-text", placeholder: "KEY=VALUE"}},
                    {id: "input", widget: {type: "repeatable-text", placeholder: "raw:text or path:/to/file"}},
                    {id: "maximize", widget: {type: "switch"}},
                    {id: "fullscreen", widget: {type: "switch"}},
                    {id: "initialWindow", widget: {type: "switch"}},
                    "workingDirectory"
                ]
            },
            {
                id: "shutdown",
                name: "Shutdown",
                settings: [
                    {id: "waitAfterCommand", widget: {type: "switch"}},
                    {id: "abnormalCommandExitRuntime", widget: {type: "number", min: 0, size: 5}},
                    {id: "confirmCloseSurface", widget: {type: "pill", options: [{value: "true", label: "On"}, {value: "false", label: "Off"}, {value: "always", label: "Always"}]}},
                    {id: "quitAfterLastWindowClosed", widget: {type: "switch"}},
                    {id: "quitAfterLastWindowClosedDelay", widget: {type: "duration", allowEmpty: true}}
                ]
            },
            {
                id: "quickTerminal",
                name: "Quick Terminal",
                settings: [
                    {id: "quickTerminalPosition", widget: {type: "dropdown", options: ["top", "right", "bottom", "left", "center"]}},
                    {id: "quickTerminalScreen", widget: {type: "dropdown", options: ["main", "mouse", "macos-menu-bar"]}},
                    "quickTerminalSize",
                    {id: "quickTerminalAnimationDuration", widget: {type: "range", min: 0, max: 10, step: 0.1, showLabels: false}},
                    {id: "quickTerminalAutohide", widget: {type: "switch"}},
                    {id: "quickTerminalSpaceBehavior", widget: {type: "pill", options: [{value: "move", label: "Move"}, {value: "remain", label: "Remain"}]}},
                    {id: "quickTerminalKeyboardInteractivity", widget: {type: "pill", options: [{value: "none", label: "None"}, {value: "on-demand", label: "On demand"}, {value: "exclusive", label: "Exclusive"}]}}
                ]
            }
        ]
    },
    {
        id: "terminal",
        icon: terminal, // TODO: replace
        name: "Terminal",
        groups: [
            {
                id: "shell",
                name: "",
                settings: [
                    {id: "shellIntegration", widget: {type: "dropdown", options: ["none", "detect", "bash", "elvish", "fish", "nushell", "zsh"]}},
                    {id: "shellIntegrationFeatures", widget: {type: "feature-list", features: [{id: "cursor", label: "Cursor", default: true}, {id: "sudo", label: "Sudo", default: false}, {id: "title", label: "Title", default: true}, {id: "ssh-env", label: "SSH environment", default: false}, {id: "ssh-terminfo", label: "SSH terminfo", default: false}, {id: "path", label: "Path", default: true}]}},
                    "term",
                    {id: "titleReport", widget: {type: "switch"}}
                ]
            },
            {
                id: "notifications",
                name: "Command Notifications",
                settings: [
                    {id: "notifyOnCommandFinish", widget: {type: "pill", options: [{value: "never", label: "Never"}, {value: "unfocused", label: "Unfocused"}, {value: "always", label: "Always"}]}},
                    {id: "notifyOnCommandFinishAction", widget: {type: "feature-list", features: [{id: "bell", label: "Bell", default: true}, {id: "notify", label: "Notification", default: false}]}},
                    {id: "notifyOnCommandFinishAfter", widget: {type: "duration", allowEmpty: false}}
                ]
            },
            {
                id: "display",
                name: "Display",
                settings: [
                    {id: "scrollbackLimit", widget: {type: "number", min: 0, size: 10}},
                    {id: "scrollToBottom", widget: {type: "feature-list", features: [{id: "keystroke", label: "On keystroke", default: true}, {id: "output", label: "On output", default: false}]}},
                    {id: "imageStorageLimit", widget: {type: "number", min: 0, max: 4294967295, size: 12}},
                    {id: "progressStyle", widget: {type: "switch"}},
                    {id: "customShader", widget: {type: "repeatable-text", placeholder: "path/to/shader.glsl"}},
                    {id: "customShaderAnimation", widget: {type: "pill", options: [{value: "false", label: "Off"}, {value: "true", label: "On"}, {value: "always", label: "Always"}]}}
                ]
            },
            {
                id: "compatibility",
                name: "Protocol & Compatibility",
                note: "These settings control low-level terminal protocol behavior. Only change these if you know what you're doing.",
                settings: [
                    {id: "oscColorReportFormat", widget: {type: "pill", options: [{value: "none", label: "None"}, {value: "8-bit", label: "8-bit"}, {value: "16-bit", label: "16-bit"}]}},
                    "enquiryResponse",
                    {id: "vtKamAllowed", widget: {type: "switch"}}
                ]
            }
        ]
    },
    {
        id: "clipboard",
        icon: clipboard,
        name: "Clipboard",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    {id: "clipboardRead", widget: {type: "pill", options: [{value: "ask", label: "Ask"}, {value: "allow", label: "Allow"}, {value: "deny", label: "Deny"}]}},
                    {id: "clipboardWrite", widget: {type: "pill", options: [{value: "ask", label: "Ask"}, {value: "allow", label: "Allow"}, {value: "deny", label: "Deny"}]}},
                    {id: "copyOnSelect", widget: {type: "pill", options: [{value: "true", label: "On"}, {value: "false", label: "Off"}, {value: "clipboard", label: "Clipboard"}]}},
                    {id: "clipboardTrimTrailingSpaces", widget: {type: "switch"}},
                    {id: "clipboardPasteProtection", widget: {type: "switch"}},
                    {id: "clipboardPasteBracketedSafe", widget: {type: "switch"}}
                ]
            }
        ]
    },
    {
        id: "window",
        icon: window,
        name: "Window",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    "windowTitleFontFamily",
                    {id: "windowSubtitle", widget: {type: "dropdown", options: ["false", "working-directory"]}},
                    {id: "windowVsync", widget: {type: "switch"}},
                    {id: "windowInheritWorkingDirectory", widget: {type: "switch"}},
                    {id: "tabInheritWorkingDirectory", widget: {type: "switch"}},
                    {id: "splitInheritWorkingDirectory", widget: {type: "switch"}},
                    {id: "windowInheritFontSize", widget: {type: "switch"}},
                    {id: "windowColorspace", widget: {type: "pill", options: [{value: "srgb", label: "sRGB"}, {value: "display-p3", label: "Display P3"}]}},
                    {id: "windowSaveState", widget: {type: "pill", options: [{value: "default", label: "Default"}, {value: "never", label: "Never"}, {value: "always", label: "Always"}]}},
                    {id: "windowShowTabBar", widget: {type: "pill", options: [{value: "always", label: "Always"}, {value: "auto", label: "Auto"}, {value: "never", label: "Never"}]}},
                    {id: "windowNewTabPosition", widget: {type: "pill", options: [{value: "current", label: "Current"}, {value: "end", label: "End"}]}}
                ]
            },
            {
                id: "appearance",
                name: "Appearance",
                settings: [
                    {id: "windowTheme", widget: {type: "dropdown", options: ["auto", "system", "light", "dark", "ghostty"]}},
                    {id: "windowDecoration", widget: {type: "dropdown", options: ["auto", "none", "client", "server"]}},
                    {id: "windowPaddingX", widget: {type: "dual-number", labels: ["Left", "Right"], min: 0}},
                    {id: "windowPaddingY", widget: {type: "dual-number", labels: ["Top", "Bottom"], min: 0}},
                    {id: "windowPaddingBalance", widget: {type: "switch"}},
                    {id: "windowPaddingColor", widget: {type: "dropdown", options: ["background", "extend", "extend-always"]}},
                    {id: "windowTitlebarBackground", widget: {type: "color"}},
                    {id: "windowTitlebarForeground", widget: {type: "color"}},
                    {id: "backgroundOpacity", widget: {type: "range", min: 0, max: 1, step: 0.01}},
                    {id: "backgroundOpacityCells", widget: {type: "switch"}},
                    {id: "backgroundBlur", widget: {type: "custom-number", presets: [{value: "false", label: "Off"}, {value: "true", label: "On"}, {value: "macos-glass-regular", label: "Regular Glass"}, {value: "macos-glass-clear", label: "Clear Glass"}], min: 0, integer: true}},
                    "backgroundImage",
                    {id: "backgroundImageOpacity", widget: {type: "range", min: 0, max: 1, step: 0.01}},
                    {id: "backgroundImagePosition", widget: {type: "dropdown", options: ["center", "top-left", "top-center", "top-right", "center-left", "center-center", "center-right", "bottom-left", "bottom-center", "bottom-right"]}},
                    {id: "backgroundImageFit", widget: {type: "dropdown", options: ["contain", "cover", "stretch", "none"]}},
                    {id: "backgroundImageRepeat", widget: {type: "switch"}},
                    {id: "scrollbar", widget: {type: "pill", options: [{value: "system", label: "System"}, {value: "never", label: "Never"}]}},
                    {id: "unfocusedSplitOpacity", widget: {type: "range", min: 0.15, max: 1, step: 0.01}},
                    {id: "unfocusedSplitFill", widget: {type: "color"}},
                    {id: "splitDividerColor", widget: {type: "color"}},
                    {id: "splitPreserveZoom", widget: {type: "switch"}}
                ]
            },
            {
                id: "resize",
                name: "Sizing & Resizing",
                settings: [
                    {id: "windowHeight", widget: {type: "number", min: 4, step: 1, size: 4, placeholder: "e.g. 24"}},
                    {id: "windowWidth", widget: {type: "number", min: 10, step: 1, size: 4, placeholder: "e.g. 80"}},
                    {id: "windowPositionY", widget: {type: "number", min: 0, step: 1, size: 4, placeholder: "e.g. 0"}},
                    {id: "windowPositionX", widget: {type: "number", min: 0, step: 1, size: 4, placeholder: "e.g. 0"}},
                    {id: "windowStepResize", widget: {type: "switch"}},
                    {id: "resizeOverlay", widget: {type: "pill", options: [{value: "always", label: "Always"}, {value: "never", label: "Never"}, {value: "after-first", label: "After first"}]}},
                    {id: "resizeOverlayPosition", widget: {type: "dropdown", options: ["center", "top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"]}},
                    {id: "resizeOverlayDuration", widget: {type: "duration", allowEmpty: false}}
                ]
            }
        ]
    },
    {
        id: "colors",
        icon: colors,
        name: "Colors",
        groups: [
            {
                id: "general",
                name: "",
                settings: [
                    {id: "theme", widget: {type: "theme", options: []}},
                    {id: "boldColor", widget: {type: "custom-color", presets: [{value: "bright", label: "Bright"}]}},
                    {id: "faintOpacity", widget: {type: "range", min: 0, max: 1, step: 0.01}},
                    {id: "minimumContrast", widget: {type: "range", min: 1, max: 21, step: 0.1}},
                    {id: "paletteGenerate", widget: {type: "switch"}},
                    {id: "paletteHarmonious", widget: {type: "switch"}}
                ]
            },
            {
                id: "base",
                name: "Base Colors",
                note: "The preview here shows selected text in the second line of the command output.",
                preview: "baseColor",
                settings: [
                    {id: "background", widget: {type: "color"}},
                    {id: "foreground", widget: {type: "color"}},
                    {id: "selectionBackground", widget: {type: "custom-color", presets: [{value: "cell-foreground", label: "Cell FG"}, {value: "cell-background", label: "Cell BG"}]}},
                    {id: "selectionForeground", widget: {type: "custom-color", presets: [{value: "cell-foreground", label: "Cell FG"}, {value: "cell-background", label: "Cell BG"}]}},
                    {id: "selectionClearOnTyping", widget: {type: "switch"}},
                    {id: "selectionClearOnCopy", widget: {type: "switch"}},
                    "selectionWordChars"
                ]
            },
            {
                id: "search",
                name: "Search Colors",
                settings: [
                    {id: "searchForeground", widget: {type: "color"}},
                    {id: "searchBackground", widget: {type: "color"}},
                    {id: "searchSelectedForeground", widget: {type: "color"}},
                    {id: "searchSelectedBackground", widget: {type: "color"}}
                ]
            },
            {
                id: "cursor",
                name: "Cursor",
                note: "The cursor in this preview blinks on and off at 1 second intervals for emphasis, it may not match what you see in Ghostty!",
                preview: "cursor",
                settings: [
                    {id: "cursorColor", widget: {type: "custom-color", presets: [{value: "cell-foreground", label: "Cell FG"}, {value: "cell-background", label: "Cell BG"}]}},
                    {id: "cursorText", widget: {type: "custom-color", presets: [{value: "cell-foreground", label: "Cell FG"}, {value: "cell-background", label: "Cell BG"}]}},
                    {id: "cursorOpacity", widget: {type: "range", min: 0, max: 1, step: 0.05}},
                    {id: "cursorStyle", widget: {type: "dropdown", options: ["block", "bar", "underline", {name: "hollow block", value: "block_hollow"}]}},
                    {id: "cursorStyleBlink", widget: {type: "pill", options: [{value: "true", label: "On"}, {value: "false", label: "Off"}, {value: "", label: "Default"}]}}
                ]
            },
            {
                id: "palette",
                name: "Color Palette",
                note: "The first 16 colors are the most commonly displayed colors in the terminal.\n\nColors 1-8 are typically black, red, green, yellow, blue, magenta, cyan, and white.\nColors 9-16 are typically \"brighter\" variants of these colors.",
                preview: "palette",
                settings: [
                    {id: "palette", widget: {type: "palette"}}
                ]
            }
        ]
    },
    {
        id: "fonts",
        icon: fonts,
        name: "Fonts",
        groups: [
            {
                id: "general",
                name: "",
                settings: [
                    {id: "fontSize", widget: {type: "range", min: 4, max: 60, step: 0.5}},
                    {id: "fontThicken", widget: {type: "switch"}},
                    {id: "fontThickenStrength", widget: {type: "range", min: 0, max: 255, step: 1}},
                    {id: "fontShapingBreak", widget: {type: "feature-list", features: [{id: "cursor", label: "Cursor", default: false}]}},
                    {id: "fontFeature", widget: {type: "repeatable-text", placeholder: "e.g. -calt"}},
                    {id: "fontSyntheticStyle", widget: {type: "feature-list", features: [{id: "bold", label: "Bold", default: true}, {id: "italic", label: "Italic", default: true}, {id: "bold-italic", label: "Bold italic", default: true}]}},
                    {id: "alphaBlending", widget: {type: "dropdown", options: ["native", "linear", "linear-corrected"]}},
                    {id: "graphemeWidthMethod", widget: {type: "pill", options: [{value: "unicode", label: "Unicode"}, {value: "legacy", label: "Legacy"}]}},
                    {id: "freetypeLoadFlags", widget: {type: "feature-list", features: [{id: "hinting", label: "Hinting", default: true}, {id: "force-autohint", label: "Force autohint", default: false}, {id: "monochrome", label: "Monochrome", default: false}, {id: "autohint", label: "Autohint", default: true}, {id: "light", label: "Light hinting", default: true}]}}
                ]
            },
            {
                id: "family",
                name: "Font Families",
                note: "By default Ghostty embeds and uses JetBrainsMono Nerd Font so you don't need to install it on your system or set it in your configuration.",
                settings: [
                    {id: "fontFamily", widget: {type: "repeatable-text", placeholder: "JetBrainsMono NF"}},
                    "fontFamilyBold",
                    "fontFamilyItalic",
                    "fontFamilyBoldItalic",
                    {id: "fontCodepointMap", widget: {type: "repeatable-text", placeholder: "U+E000-U+E0FF=Symbols Nerd Font"}}
                ]
            },
            {
                id: "styles",
                name: "Font Styles",
                note: "Named font styles for the fields above. For example for <code>Ioveska Heavy</code> you would use a style of <code>Heavy</code>. Alternately you can set the style to <code>false</code> to completely disable the style and revert to default style.",
                settings: [
                    "fontStyle",
                    "fontStyleBold",
                    "fontStyleItalic",
                    "fontStyleBoldItalic"
                ]
            },
            {
                id: "variations",
                name: "Font Variations",
                note: "Variable font specific settings, please only touch this if you know what you're doing!",
                settings: [
                    {id: "fontVariation", widget: {type: "repeatable-text", placeholder: "e.g. wght=600"}},
                    "fontVariationBold",
                    "fontVariationItalic",
                    "fontVariationBoldItalic"
                ]
            },
            {
                id: "advanced",
                name: "Metric Adjustments",
                note: "Fine-grained pixel/percentage tweaks to cell and glyph metrics. These have very little validation in Ghostty and can make your terminal unusable. Be careful messing with any of these.",
                settings: [
                    {id: "adjustCellWidth", widget: {type: "number-units"}},
                    {id: "adjustCellHeight", widget: {type: "number-units"}},
                    {id: "adjustFontBaseline", widget: {type: "number-units"}},
                    {id: "adjustUnderlinePosition", widget: {type: "number-units"}},
                    {id: "adjustUnderlineThickness", widget: {type: "number-units"}},
                    {id: "adjustStrikethroughPosition", widget: {type: "number-units"}},
                    {id: "adjustStrikethroughThickness", widget: {type: "number-units"}},
                    {id: "adjustOverlinePosition", widget: {type: "number-units"}},
                    {id: "adjustOverlineThickness", widget: {type: "number-units"}},
                    {id: "adjustCursorThickness", widget: {type: "number-units"}},
                    {id: "adjustBoxThickness", widget: {type: "number-units"}},
                    {id: "adjustCursorHeight", widget: {type: "number-units"}},
                    {id: "adjustIconHeight", widget: {type: "number-units"}}
                ]
            }
        ]
    },
    {
        id: "keybinds",
        icon: keybinds,
        name: "Keybinds",
        groups: [
            {
                id: "keybinds",
                name: "",
                settings: [
                    "keybind"
                ]
            }
        ]
    },
    {
        id: "mouse",
        icon: mouse,
        name: "Mouse",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    {id: "cursorClickToMove", widget: {type: "switch"}},
                    {id: "mouseHideWhileTyping", widget: {type: "switch"}},
                    {id: "mouseReporting", widget: {type: "switch"}},
                    {id: "mouseShiftCapture", widget: {type: "dropdown", options: ["true", "false", "always", "never"]}},
                    {id: "mouseScrollMultiplier", widget: {type: "scroll-multiplier"}},
                    {id: "rightClickAction", widget: {type: "dropdown", options: ["context-menu", "copy-or-paste", "copy", "paste", "ignore"]}},
                    {id: "middleClickAction", widget: {type: "dropdown", options: ["primary-paste", "ignore"]}},
                    {id: "focusFollowsMouse", widget: {type: "switch"}},
                    {id: "clickRepeatInterval", widget: {type: "number", min: 0, size: 4}}
                ]
            }
        ]
    },
    {
        id: "gtk",
        icon: gtk,
        name: "GTK",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    "language",
                    "class",
                    "x11InstanceName",
                    {id: "gtkSingleInstance", widget: {type: "pill", options: [{value: "detect", label: "Detect"}, {value: "true", label: "On"}, {value: "false", label: "Off"}]}},
                    "gtkCustomCss",
                    {id: "gtkOpenglDebug", widget: {type: "switch"}},
                    {id: "appNotifications", widget: {type: "feature-list", features: [{id: "clipboard-copy", label: "Clipboard copy", default: true}, {id: "config-reload", label: "Config reload", default: true}]}}
                ]
            },
            {
                id: "tabs",
                name: "Titlebar & Tabs",
                settings: [
                    {id: "gtkToolbarStyle", widget: {type: "dropdown", options: ["raised", "flat", "raised-border"]}},
                    {id: "gtkTitlebarStyle", widget: {type: "pill", options: [{value: "native", label: "Native"}, {value: "tabs", label: "Tabs"}]}},
                    {id: "gtkTabsLocation", widget: {type: "pill", options: [{value: "top", label: "Top"}, {value: "bottom", label: "Bottom"}]}},
                    {id: "gtkWideTabs", widget: {type: "switch"}},
                    {id: "gtkTitlebar", widget: {type: "switch"}},
                    {id: "gtkTitlebarHideWhenMaximized", widget: {type: "switch"}},
                    {id: "gtkQuickTerminalLayer", widget: {type: "dropdown", options: ["overlay", "top", "bottom", "background"]}},
                    {id: "gtkQuickTerminalNamespace", widget: {type: "text", size: 18}}
                ]
            }
        ]
    },
    {
        id: "linux",
        icon: linux,
        name: "Linux",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    {id: "asyncBackend", widget: {type: "dropdown", options: ["auto", "epoll", "io_uring"]}},
                    {id: "linuxCgroup", widget: {type: "dropdown", options: ["single-instance", "always", "never"]}},
                    {id: "linuxCgroupMemoryLimit", widget: {type: "number", min: 0, max: 4294967295, size: 12}},
                    {id: "linuxCgroupProcessesLimit", widget: {type: "number", min: 0, size: 5}},
                    {id: "linuxCgroupHardFail", widget: {type: "switch"}}
                ]
            }
        ]
    },
    {
        id: "macos",
        icon: macos,
        name: "macOS",
        groups: [
            {
                id: "main",
                name: "",
                settings: [
                    {id: "macosNonNativeFullscreen", widget: {type: "dropdown", options: ["visible-menu", "true", "false", "padded-notch"]}},
                    {id: "macosTitlebarStyle", widget: {type: "dropdown", options: ["transparent", "native", "tabs", "hidden"]}},
                    {id: "macosTitlebarProxyIcon", widget: {type: "pill", options: [{value: "visible", label: "Visible"}, {value: "hidden", label: "Hidden"}]}},
                    {id: "macosOptionAsAlt", widget: {type: "dropdown", options: ["true", "false", "left", "right"], allowEmpty: true, emptyLabel: "Reset to default"}},
                    {id: "macosWindowShadow", widget: {type: "switch"}},
                    {id: "macosWindowButtons", widget: {type: "pill", options: [{value: "visible", label: "Visible"}, {value: "hidden", label: "Hidden"}]}},
                    {id: "macosHidden", widget: {type: "pill", options: [{value: "never", label: "Never"}, {value: "always", label: "Always"}]}},
                    {id: "macosAutoSecureInput", widget: {type: "switch"}},
                    {id: "macosSecureInputIndication", widget: {type: "switch"}},
                    {id: "macosApplescript", widget: {type: "switch"}},
                    {id: "macosDockDropBehavior", widget: {type: "pill", options: [{value: "new-tab", label: "New tab"}, {value: "new-window", label: "New window"}]}},
                    {id: "macosShortcuts", widget: {type: "pill", options: [{value: "allow", label: "Allow"}, {value: "deny", label: "Deny"}, {value: "ask", label: "Ask"}]}},
                    {id: "autoUpdate", widget: {type: "dropdown", options: ["off", "check", "download"], allowEmpty: true, emptyLabel: "Follow Sparkle", placeholder: "Follow Sparkle"}},
                    {id: "autoUpdateChannel", widget: {type: "dropdown", options: ["stable", "tip"], allowEmpty: true, emptyLabel: "Current Sparkle", placeholder: "Current Channel"}}
                ]
            },
            {
                id: "icon",
                name: "App Icon",
                note: "If you choose the <code>custom-style</code> option, you can use any of the other icon settings to customize your icon with a live preview.",
                preview: "appIcon",
                settings: [
                    {id: "macosIcon", widget: {type: "dropdown", options: []}},
                    "macosCustomIcon",
                    {id: "macosIconFrame", widget: {type: "dropdown", options: []}},
                    {id: "macosIconGhostColor", widget: {type: "color"}},
                    {id: "macosIconScreenColor", widget: {type: "color"}}
                ]
            }
        ]
    }
] as const satisfies NavPanel[];

export default navigation;

type TopLevelPanelIDs = typeof navigation[number]["id"];
type TabGroups = TopLevelPanelIDs[][];

export const tabGroups: TabGroups = [
    ["application", "terminal", "clipboard"],
    ["window", "colors", "fonts"],
    ["keybinds", "mouse"],
    ["gtk", "linux", "macos"]
];

// Validation: run at build time or in dev
export function validateNavigation() {
    const seen = new Set<string>();
    const walk = (panels: NavPanel[]) => {
        for (const panel of panels) {
            for (const group of panel.groups ?? []) {
                for (const entry of group.settings) {
                    const id = typeof entry === "string" ? entry : entry.id;
                    if (!(id in registry)) throw new Error(`Unknown setting id in nav tree: ${id}`);
                    if (seen.has(id)) throw new Error(`Duplicate setting id in nav tree: ${id}`);
                    seen.add(id);
                }
            }
            if (panel.pages) walk(panel.pages);
        }
    };
    walk(navigation);

    for (const id of Object.keys(registry)) {
        if (!seen.has(id)) throw new Error(`Setting "${id}" exists in registry but is not categorized in navigation`);
    }
}

if (dev) validateNavigation();