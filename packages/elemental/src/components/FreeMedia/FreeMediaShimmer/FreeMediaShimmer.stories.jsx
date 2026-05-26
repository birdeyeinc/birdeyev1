import FreeMediaShimmer from './index';

export default {
  title: 'Modules/FreeMedia/FreeMediaShimmer',
  component: FreeMediaShimmer,
};

export const InitialLoading = { args: { initialLoading: true, perPageLimit: 12 } };
export const LoadMore = { args: { initialLoading: false } };