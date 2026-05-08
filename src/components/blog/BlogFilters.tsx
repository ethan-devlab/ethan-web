type BlogFiltersProps = {
  lang: 'zh' | 'en'
  searchText: string
  onSearchTextChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  categories: string[]
  tag: string
  onTagChange: (value: string) => void
  tags: string[]
  language: string
  onLanguageChange: (value: string) => void
}

export function BlogFilters({
  lang,
  searchText,
  onSearchTextChange,
  language,
  onLanguageChange,
  category,
  onCategoryChange,
  categories,
  tag,
  onTagChange,
  tags,
}: BlogFiltersProps) {
  return (
    <div className="blog-controls">
      <input
        type="search"
        value={searchText}
        placeholder={lang === 'zh' ? '搜尋標題、摘要、標籤、分類' : 'Search title, description, tags, category'}
        onChange={(event) => onSearchTextChange(event.target.value)}
      />

      <select value={language} onChange={(event) => onLanguageChange(event.target.value)}>
        <option value="all">{lang === 'zh' ? '所有語言' : 'All languages'}</option>
        <option value="zh">中文</option>
        <option value="en">English</option>
      </select>

      <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
        <option value="all">{lang === 'zh' ? '所有分類' : 'All categories'}</option>
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select value={tag} onChange={(event) => onTagChange(event.target.value)}>
        <option value="all">{lang === 'zh' ? '所有標籤' : 'All tags'}</option>
        {tags.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  )
}
