<template>
    <v-data-table-server
        :headers="headers"
        :items="items"
        :loading="loading"
        :items-length="totalItems"
        v-model:items-per-page="localItemsPerPage"
        :search="search"
        @search="updateSearch"
        v-model:sort-by="sortBy"
        v-model:page="currentPage"
        :item-value="itemValue"
        :show-expand="showExpand"
        :class="tableClass"
    >
        <template v-for="slot in headerSlots" :key="slot.key" v-slot:[`item.${slot.key}`]="{ item }">
            <slot :name="`item.${slot.key}`" :item="item">{{ (item as Record<string, unknown>)[slot.key] }}</slot>
        </template>
        <template v-slot:item.data-table-expand="{ internalItem, isExpanded, toggleExpand }">
            <slot :name="`item.data-table-expand`" :internalItem="internalItem" :isExpanded="isExpanded" :toggleExpand="toggleExpand">
                <v-btn @click="toggleExpand(internalItem)" rounded>
                    <v-icon>{{ isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
            </slot>
        </template>
        <template v-slot:expanded-row="{ columns, item }">
            <slot :name="`expanded-row`" :columns="columns" :item="item"></slot>
        </template>
        <template v-slot:item.actions="{ item }">
            <slot name="before-actions" :item="item"></slot>
            <v-tooltip :text="viewButtonText" v-if="showViewButton">
                <template v-slot:activator="{ props }">
                    <v-btn icon flat @click="viewItem(item)" v-bind="props">
                        <slot name="view-icon">
                            <component v-if="isIconComponent(resolvedViewIcon)" :is="resolvedViewIcon" :size="20" class="text-info" v-bind="globalIconProps" />
                            <v-icon v-else size="20" class="text-info">{{ resolvedViewIcon }}</v-icon>
                        </slot>
                    </v-btn>
                </template>
            </v-tooltip>
            <v-tooltip :text="editButtonText" v-if="showEditButton">
                <template v-slot:activator="{ props }">
                    <v-btn icon flat @click="editItem(item)" v-bind="props">
                        <slot name="edit-icon">
                            <component v-if="isIconComponent(resolvedEditIcon)" :is="resolvedEditIcon" :size="20" class="text-primary" v-bind="globalIconProps" />
                            <v-icon v-else size="20" class="text-primary">{{ resolvedEditIcon }}</v-icon>
                        </slot>
                    </v-btn>
                </template>
            </v-tooltip>
            <v-tooltip :text="deleteButtonText" v-if="showDeleteButton">
                <template v-slot:activator="{ props }">
                    <v-btn icon flat @click="openDeleteModal(item)" v-bind="props">
                        <slot name="delete-icon">
                            <component v-if="isIconComponent(resolvedDeleteIcon)" :is="resolvedDeleteIcon" :size="20" class="text-error" v-bind="globalIconProps" />
                            <v-icon v-else size="20" class="text-error">{{ resolvedDeleteIcon }}</v-icon>
                        </slot>
                    </v-btn>
                </template>
            </v-tooltip>
            <slot name="after-actions" :item="item"></slot>
        </template>
        <template v-slot:tfoot>
            <tfoot>
                <slot name="item.tfoot"></slot>
            </tfoot>
        </template>
    </v-data-table-server>

    <ConfirmationModal
        :show="dialogDelete"
        :title="deleteModalTitle"
        :description="deleteModalMessage"
        :confirmButtonText="deleteModalConfirmButtonText"
        :cancelButtonText="deleteModalCancelButtonText"
        @close="closeDeleteModal"
        @confirm="deleteItem"
    />
</template>

<script setup lang="ts" generic="T">
import { ref, computed, watch, onMounted, inject, type Component } from 'vue';
import debounce from 'debounce';
import ConfirmationModal from './ConfirmationModal.vue';
import { DATA_TABLE_CONFIG_KEY } from '../config';
import type { TableHeader, SortItem, DataTableConfig } from '../types';

// Props
const props = withDefaults(
    defineProps<{
        tableClass?: string;
        headers?: TableHeader[];
        items?: T[];
        loading?: boolean;
        itemValue?: string;
        totalItems?: number;
        itemsPerPage?: number;
        search?: string;
        showExpand?: boolean;
        showEditButton?: boolean;
        showDeleteButton?: boolean;
        showViewButton?: boolean;
        viewButtonText?: string;
        deleteButtonText?: string;
        deleteModalTitle?: string;
        deleteModalMessage?: string;
        deleteModalConfirmButtonText?: string;
        deleteModalCancelButtonText?: string;
        editButtonText?: string;
        viewIcon?: string;
        editIcon?: string;
        deleteIcon?: string;
    }>(),
    {
        tableClass: 'border rounded-md mt-5',
        headers: () => [],
        items: () => [] as T[],
        loading: false,
        itemValue: 'id',
        totalItems: 0,
        itemsPerPage: 10,
        showExpand: false,
        showEditButton: true,
        showDeleteButton: true,
        showViewButton: false
    }
);

// Emits
const emit = defineEmits(['onLoadData', 'editItem', 'deleteItem', 'viewItem']);

// Global Config (provide/inject)
const globalConfig = inject<DataTableConfig>(DATA_TABLE_CONFIG_KEY, { icons: {} });

// Resolved Icons: prop > global config > MDI default
const resolvedViewIcon = computed<string | Component>(() => props.viewIcon ?? globalConfig.icons?.view ?? 'mdi-eye-outline');
const resolvedEditIcon = computed<string | Component>(() => props.editIcon ?? globalConfig.icons?.edit ?? 'mdi-pencil-outline');
const resolvedDeleteIcon = computed<string | Component>(() => props.deleteIcon ?? globalConfig.icons?.delete ?? 'mdi-trash-can-outline');
const globalIconProps = computed(() => globalConfig.iconProps ?? {});

function isIconComponent(icon: string | Component): icon is Component {
    return typeof icon !== 'string';
}

// Refs
const localItemsPerPage = ref<number>(props.itemsPerPage);
const sortBy = ref<SortItem[]>([]);
const currentPage = ref<number>(1);
const selectedItem = ref<unknown>(null);
const dialogDelete = ref<boolean>(false);

// Header Slots
const headerSlots = computed(() => {
    return (
        (props.headers as TableHeader[])?.filter(
            (header: TableHeader) => header.key !== 'actions' && header.key !== 'expanded-row' && header.key !== 'data-table-expand'
        ) || []
    );
});

// Load Data on Mounted
onMounted(() => {
    loadData({
        page: currentPage.value,
        itemsPerPage: localItemsPerPage.value
    });
});

// Open Delete Modal
const openDeleteModal = (item: unknown) => {
    selectedItem.value = item;
    dialogDelete.value = true;
};

// Close Delete Modal
const closeDeleteModal = () => {
    selectedItem.value = null;
    dialogDelete.value = false;
};

// Edit Item Event
const editItem = (item: unknown) => {
    emit('editItem', item);
};

// View Item Event
const viewItem = (item: unknown) => {
    emit('viewItem', item);
};

// Delete Item Event
const deleteItem = () => {
    emit('deleteItem', selectedItem.value);
    dialogDelete.value = false;
};

// Payload Event
const loadData = ({ page, itemsPerPage }: { page: number; itemsPerPage: number }) => {
    const sortParams = sortBy.value.map((sort: SortItem) => ({
        column: sort.key,
        direction: sort.order
    }));

    emit('onLoadData', {
        page: page,
        itemsPerPage: itemsPerPage,
        search: props.search,
        sortBy: sortParams
    });
};

/**
 * Trigger data loading when the search input changes.
 * Debounced to avoid excessive backend requests while typing.
 */
function requestLoadDataForSearch(): void {
    loadData({
        page: 1,
        itemsPerPage: localItemsPerPage.value
    });
}

// Debounced handler for search updates (400ms)
const debouncedRequestLoadDataForSearch = debounce(requestLoadDataForSearch, 400);

// Called by v-data-table-server @search event
const updateSearch = (): void => {
    debouncedRequestLoadDataForSearch();
};

// Watch search
watch(
    () => props.search,
    (newValue, oldValue) => {
        if (newValue !== oldValue) {
            debouncedRequestLoadDataForSearch();
        }
    }
);

// Watch itemsPerPage
watch(localItemsPerPage, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        loadData({
            page: 1,
            itemsPerPage: newValue
        });
    }
});

// Watch sortBy
watch(sortBy, () => {
    loadData({
        page: 1,
        itemsPerPage: localItemsPerPage.value
    });
});

// Watch currentPage
watch(currentPage, (newValue) => {
    loadData({
        page: newValue,
        itemsPerPage: localItemsPerPage.value
    });
});
</script>
