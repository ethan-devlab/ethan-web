export type BlogFilterState = {
  searchText: string
  selectedLanguage: string
  selectedCategory: string
  selectedTag: string
}

export function getBlogFiltersFromState(state: unknown): BlogFilterState | undefined {
  if (!state || typeof state !== 'object' || !('blogFilters' in state)) return undefined
  const filters = state.blogFilters
  if (!filters || typeof filters !== 'object') return undefined
  if (
    !('searchText' in filters) || typeof filters.searchText !== 'string'
    || !('selectedLanguage' in filters) || typeof filters.selectedLanguage !== 'string'
    || !('selectedCategory' in filters) || typeof filters.selectedCategory !== 'string'
    || !('selectedTag' in filters) || typeof filters.selectedTag !== 'string'
  ) return undefined
  return {
    searchText: filters.searchText,
    selectedLanguage: filters.selectedLanguage,
    selectedCategory: filters.selectedCategory,
    selectedTag: filters.selectedTag,
  }
}
