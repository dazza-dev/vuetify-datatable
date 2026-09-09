# @dazzadev/vuetify-datatable

Reusable server-side DataTable component for Vuetify 3 and 4. Includes action buttons (view, edit, delete), configurable icons, and a built-in delete confirmation dialog.

## Installation

```bash
npm install @dazzadev/vuetify-datatable
```

## Setup

### Register globally (recommended)

```ts
// main.ts
import { createApp } from "vue";
import VuetifyDatatable from "@dazzadev/vuetify-datatable";

const app = createApp(App);
app.use(VuetifyDatatable);
```

### Or import individually

```ts
import { DataTable } from "@dazzadev/vuetify-datatable";
```

## Basic Usage

```vue
<template>
  <DataTable
    :headers="headers"
    :items="items"
    :loading="loading"
    :total-items="totalItems"
    :search="search"
    @onLoadData="loadData"
    @editItem="editItem"
    @deleteItem="deleteItem"
  />
</template>
```

## Row Selection

Set `showSelect` and bind `v-model` to hold the selected keys. **The key comes from `itemValue`**,
so point it at whatever your bulk endpoint expects — not necessarily `id`.

```vue
<DataTable
    v-model="selected"
    :headers="headers"
    :items="items"
    :totalItems="totalItems"
    item-value="uuid"
    show-select
    @onLoadData="loadData"
>
    <template #selection-actions="{ count, clear }">
        <div v-if="count" class="d-flex align-center ga-2 pa-2">
            <span>{{ count }} selected</span>
            <v-btn size="small" @click="applyToSelection">Apply</v-btn>
            <v-btn size="small" variant="text" @click="clear">Clear</v-btn>
        </div>
    </template>
</DataTable>
```

`selectStrategy` decides what the header checkbox does: `page` marks the current page only, `all`
marks every loaded row, `single` allows one row at a time. With server-side pagination `page` is
usually what you want — the table only holds the rows it has fetched.

## Icon Configuration

Icons can be configured at 4 levels of priority (highest to lowest):

### 1. Slots (full control per instance)

```vue
<DataTable :headers="headers" :items="items">
    <template #view-icon>
        <MyCustomIcon />
    </template>
    <template #edit-icon>
        <img src="/icons/edit.svg" width="20" />
    </template>
    <template #delete-icon>
        <i class="fa-solid fa-trash"></i>
    </template>
</DataTable>
```

### 2. Props (string override per instance)

```vue
<DataTable
  view-icon="mdi-magnify"
  edit-icon="mdi-square-edit-outline"
  delete-icon="mdi-delete"
/>
```

### 3. Global plugin config (configure once, applies everywhere)

```ts
// main.ts
import { createDataTableConfig } from "@dazzadev/vuetify-datatable";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-vue";

app.use(
  createDataTableConfig({
    icons: {
      view: IconEye,
      edit: IconPencil,
      delete: IconTrash,
    },
    iconProps: { "stroke-width": 1.5 },
  }),
);
```

This works with any icon library: Tabler, FontAwesome, Heroicons, or any Vue component.

### 4. MDI defaults (no config needed)

If no configuration is provided, the component uses Material Design Icons (included with Vuetify):

- View: `mdi-eye-outline`
- Edit: `mdi-pencil-outline`
- Delete: `mdi-trash-can-outline`

## Props

| Prop                           | Type            | Default                    | Description                            |
| ------------------------------ | --------------- | -------------------------- | -------------------------------------- |
| `headers`                      | `TableHeader[]` | `[]`                       | Table column headers                   |
| `items`                        | `T[]`           | `[]`                       | Table row data                         |
| `loading`                      | `boolean`       | `false`                    | Show loading state                     |
| `totalItems`                   | `number`        | `0`                        | Total items for server-side pagination |
| `itemsPerPage`                 | `number`        | `10`                       | Items per page                         |
| `search`                       | `string`        | —                          | Search query                           |
| `itemValue`                    | `string`        | `'id'`                     | Unique item identifier key             |
| `tableClass`                   | `string`        | `'border rounded-md mt-5'` | CSS class for the table                |
| `showExpand`                   | `boolean`       | `false`                    | Show expandable rows                   |
| `showSelect`                   | `boolean`       | `false`                    | Show a checkbox column for row selection |
| `selectStrategy`               | `'page' \| 'all' \| 'single'` | `'page'`       | How the header checkbox selects rows   |
| `modelValue`                   | `(string \| number)[]` | `[]`               | Selected keys, taken from `itemValue`. Use with `v-model` |
| `showViewButton`               | `boolean`       | `false`                    | Show view action button                |
| `showEditButton`               | `boolean`       | `true`                     | Show edit action button                |
| `showDeleteButton`             | `boolean`       | `true`                     | Show delete action button              |
| `viewButtonText`               | `string`        | —                          | View button tooltip text               |
| `editButtonText`               | `string`        | —                          | Edit button tooltip text               |
| `deleteButtonText`             | `string`        | —                          | Delete button tooltip text             |
| `deleteModalTitle`             | `string`        | —                          | Delete confirmation modal title        |
| `deleteModalMessage`           | `string`        | —                          | Delete confirmation modal message      |
| `deleteModalConfirmButtonText` | `string`        | —                          | Confirm button text                    |
| `deleteModalCancelButtonText`  | `string`        | —                          | Cancel button text                     |
| `viewIcon`                     | `string`        | —                          | View icon name override                |
| `editIcon`                     | `string`        | —                          | Edit icon name override                |
| `deleteIcon`                   | `string`        | —                          | Delete icon name override              |
| `disableView`                  | `(item: T) => boolean` | —                   | Per-row predicate: disable the view button when it returns `true`   |
| `disableEdit`                  | `(item: T) => boolean` | —                   | Per-row predicate: disable the edit button when it returns `true`   |
| `disableDelete`                | `(item: T) => boolean` | —                   | Per-row predicate: disable the delete button when it returns `true` |

## Events

| Event        | Payload          | Description                                      |
| ------------ | ---------------- | ------------------------------------------------ |
| `onLoadData` | `LoadDataParams` | Triggered on pagination, sort, or search changes |
| `editItem`   | `T`              | Triggered when edit button is clicked            |
| `deleteItem` | `T`              | Triggered when delete is confirmed               |
| `viewItem`   | `T`              | Triggered when view button is clicked            |
| `update:modelValue` | `(string \| number)[]` | Triggered when the selection changes    |

## Slots

| Slot                     | Description                                |
| ------------------------ | ------------------------------------------ |
| `item.{key}`             | Custom render for any column by header key |
| `expanded-row`           | Content for expandable rows                |
| `item.data-table-expand` | Custom expand toggle button                |
| `before-actions`         | Content before action buttons              |
| `after-actions`          | Content after action buttons               |
| `view-icon`              | Custom view icon                           |
| `edit-icon`              | Custom edit icon                           |
| `delete-icon`            | Custom delete icon                         |
| `item.tfoot`             | Table footer content                       |
| `selection-actions`      | Bar above the table, for bulk actions. Only rendered when `showSelect`. Receives `{ selected, count, clear }` |

## Peer Dependencies

- `vue` >= 3.3
- `vuetify` 3.x or 4.x

The component only uses the `v-data-table-server` API that is common to both major
versions, so a single build works with either.

## License

MIT
