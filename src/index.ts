import type { App } from 'vue';
import DataTable from './components/DataTable.vue';
import { createDataTableConfig, DATA_TABLE_CONFIG_KEY } from './config';

export { DataTable };
export { createDataTableConfig, DATA_TABLE_CONFIG_KEY };
export type { DataTableConfig, DataTableIconConfig, TableHeader, SortItem, LoadDataParams } from './types';

export default {
    install(app: App) {
        app.component('DataTable', DataTable);
    }
};
