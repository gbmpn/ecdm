'use client';

export default function Filters({
  categories,
  selectedCategory,
  onSelectCategory,
  getProjectCount,
}) {
  return (
    <div className="filters">
      {categories.map((category) => (
        <button
          key={category}
          className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => onSelectCategory(category)}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
          <sup className="count">({getProjectCount(category)})</sup>
        </button>
      ))}
    </div>
  );
}
