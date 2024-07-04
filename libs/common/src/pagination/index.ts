import { Exception } from '@app/common/exceptions';
import { Page, PageMetadata } from './types';

export const Divide = (x: number, y: number) => {
  if (y === 0) throw new Error('Cannot divide zero');
  const resInt = Math.floor(x / y);
  const resRem = x % y;
  return [resInt, resRem];
};

type createPageFunction = {
  (val: any[], pageSize: number, currentPage: number): Page;
  (val: any[], pageMetadata: PageMetadata): Page;
};

export const createPage: createPageFunction = (
  ...args: [any[], number, number] | [any[], PageMetadata]
): Page => {
  if (args.length === 3) {
    const [val, pageSize, currentPage] = args;
    return {
      page_data: val,
      page_meta: createPageMetadata(val, pageSize, currentPage),
    };
  }
  if (args.length === 2) {
    const [val, pageMetadata] = args;
    return {
      page_data: val,
      page_meta: { ...pageMetadata },
    };
  }
};

export const getMaxPossiblePageIndex = (totalNum: number, pageSize: number) => {
  const [resInt, resRem] = Divide(totalNum, pageSize);
  let toHavePage: number;
  if (resInt >= 0 && resRem > 0) {
    toHavePage = resInt + 1;
  } else if (resInt > 0 && resRem === 0) {
    toHavePage = resInt;
  }
  return toHavePage;
};

export const createPageMetadata = (
  totals: any[] | number,
  pageSize: number,
  currentPage: number,
): PageMetadata => {
  let toHaveItems: number;
  if (Array.isArray(totals)) {
    toHaveItems = totals.length;
  } else {
    toHaveItems = totals;
  }
  // if (toHaveItems === 0) {
  //   throw new Exception(`Cannot create page metadata for nothing`);
  // }
  const [resInt, resRem] = Divide(toHaveItems, pageSize);

  let toHavePage: number;
  let lastPageItem: number;
  if (resInt >= 0 && resRem > 0) {
    toHavePage = resInt + 1;
    lastPageItem = resRem;
  } else if (resInt > 0 && resRem === 0) {
    toHavePage = resInt;
    lastPageItem = pageSize;
  }

  if (currentPage > toHavePage) {
    // throw new Exception(
    //   `Unexpected page index, expected to have maximum page index: ${toHavePage} for page capacity: ${pageSize}, but request for page index: ${currentPage}`,
    // );
    currentPage = toHavePage;
  }
  const isLastPage = currentPage === toHavePage ? true : false;

  return {
    current_page: currentPage,
    total_pages: toHavePage,
    total_items: toHaveItems,
    page_capacity: pageSize,
    page_item_num: isLastPage ? lastPageItem : pageSize,
    is_last_page: isLastPage,
  };
};
