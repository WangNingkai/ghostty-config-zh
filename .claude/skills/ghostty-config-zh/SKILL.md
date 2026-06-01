```markdown
# ghostty-config-zh Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development patterns and conventions used in the `ghostty-config-zh` TypeScript codebase. You'll learn how to structure files, write imports/exports, and follow the main workflow for updating settings-related features. This guide also covers testing patterns and provides quick commands for common tasks.

## Coding Conventions

### File Naming
- **PascalCase** is used for file names.
  - Example: `Item.svelte`, `Number.svelte`, `ConfigStore.ts`

### Import Style
- **Absolute imports** are preferred.
  - Example:
    ```typescript
    import { updateSetting } from 'src/lib/stores/config.svelte.ts';
    ```

### Export Style
- **Named exports** are used throughout the codebase.
  - Example:
    ```typescript
    export function resetSettings() { /* ... */ }
    ```

## Workflows

### Settings Feature Update
**Trigger:** When someone wants to add, fix, or enhance the settings functionality.  
**Command:** `/update-settings-feature`

Follow these steps to implement or fix features related to settings (e.g., resetting settings, improving settings UI/UX):

1. **Modify the settings item component**
   - Edit `src/lib/components/settings/Item.svelte` to update the UI or logic for individual settings.
   - Example:
     ```svelte
     <script lang="ts">
       export let label: string;
       export let value: any;
       // Add new prop or logic here
     </script>
     ```

2. **Update the settings store**
   - Update `src/lib/stores/config.svelte.ts` to handle new or changed settings logic.
   - Example:
     ```typescript
     export function updateSetting(key: string, value: any) {
       // Update logic for new setting
     }
     ```

3. **Edit the settings page**
   - Edit `src/routes/settings/[category]/+page.svelte` to reflect changes in the settings page.
   - Example:
     ```svelte
     <Item label="New Setting" value={config.newSetting} />
     ```

4. **(Optional) Update number settings component**
   - If number settings are affected, update `src/lib/components/settings/Number.svelte`.

## Testing Patterns

- **Test Framework:** Unknown (not detected).
- **Test File Pattern:** Files follow the `*.test.*` naming convention.
  - Example: `ConfigStore.test.ts`
- **General Approach:** Place test files alongside the code they test, using the `.test.` pattern.

## Commands

| Command                  | Purpose                                                      |
|--------------------------|--------------------------------------------------------------|
| /update-settings-feature | Start the workflow for updating or fixing settings features. |

```