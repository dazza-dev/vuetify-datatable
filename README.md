# @dazzadev/vuetify-datatable

Reusable server-side DataTable component for Vuetify 3. Includes action buttons (view, edit, delete), configurable icons, and a built-in delete confirmation dialog.

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

## Events

| Event        | Payload          | Description                                      |
| ------------ | ---------------- | ------------------------------------------------ |
| `onLoadData` | `LoadDataParams` | Triggered on pagination, sort, or search changes |
| `editItem`   | `T`              | Triggered when edit button is clicked            |
| `deleteItem` | `T`              | Triggered when delete is confirmed               |
| `viewItem`   | `T`              | Triggered when view button is clicked            |

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

## Peer Dependencies

- `vue` >= 3.3
- `vuetify` >= 3.0

## License

MIT
