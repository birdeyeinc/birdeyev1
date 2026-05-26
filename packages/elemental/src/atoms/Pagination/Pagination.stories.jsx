import PaginationModuleComponent from './index';

export default {
  title: 'Atom/PaginationModule',
  component: PaginationModuleComponent,
}
export const PaginationModule = {
  args: {
    initialPage: 1,
    pageCount: 10,
    pageSize: 10,
    className: '',
    itemRender: false,
    showPageSize: false,
    pageSizeOnTop: false,
    wrapperClass: '',
    newPagination: false,
    totalCount: 100,
  },
  argTypes: {
    initialPage: { control: 'number', description: 'The current active page' },
    pageCount: { control: 'number', description: 'Total number of pages' },
    pageSize: { control: 'number', description: 'Number of items per page' },
    className: { control: 'text', description: 'Custom CSS class for styling' },
    itemRender: { control: 'boolean', description: 'Flag to render custom text for prev/next buttons' },
    showPageSize: { control: 'boolean', description: 'Flag to show page size selector' },
    pageSizeOnTop: { control: 'boolean', description: 'Position of the page size selector' },
    wrapperClass: { control: 'text', description: 'Custom wrapper class' },
    newPagination: { control: 'boolean', description: 'Flag for new pagination style' },
    onPageChange: { action: 'pageChanged', description: 'Function to call when page changes' },
    changePageSize: { action: 'pageSizeChanged', description: 'Function to call when page size changes' },
  },
};
