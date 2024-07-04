import { isObject } from 'class-validator';

export interface PageMetadata {
  current_page: number;
  total_pages: number;
  total_items: number;
  page_capacity: number;
  page_item_num: number;
  is_last_page: boolean;
}

export interface Page {
  page_data: any[];
  page_meta: PageMetadata;
}

export const isPageMetadata = (val: unknown): val is PageMetadata => {
  if (!isObject(val)) return false;
  const x =
    'current_page' in val &&
    'total_pages' in val &&
    'total_items' in val &&
    'page_capacity' in val &&
    'page_item_num' in val &&
    'is_last_page' in val;
  return x;
};
export const isPage = (val: unknown): val is Page => {
  if (!isObject(val)) return false;
  const x = 'page_data' in val && 'page_meta' in val;
  return x;
};
