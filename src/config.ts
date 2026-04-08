import type { InjectionKey, App } from 'vue';
import type { DataTableConfig } from './types';

export const DATA_TABLE_CONFIG_KEY: InjectionKey<DataTableConfig> = Symbol('DataTableConfig');

export function createDataTableConfig(config: DataTableConfig) {
    return {
        install(app: App) {
            app.provide(DATA_TABLE_CONFIG_KEY, config);
        }
    };
}
