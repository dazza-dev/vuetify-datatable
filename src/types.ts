import type { Component } from "vue";

export interface TableHeader {
  key: string;
  title?: string;
  align?: string;
  sortable?: boolean;
  fixed?: boolean;
}

export interface SortItem {
  key: string;
  order: "asc" | "desc";
}

export interface DataTableIconConfig {
  view?: string | Component;
  edit?: string | Component;
  delete?: string | Component;
}

export interface DataTableConfig {
  icons?: DataTableIconConfig;
  iconProps?: Record<string, unknown>;
}

export interface LoadDataParams {
  page: number;
  itemsPerPage: number;
  search?: string;
  sortBy?: { column: string; direction: string }[];
}
