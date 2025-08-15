'use client';

interface FileFiltersProps {
  selectedCategory: string;
  searchTerm: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
}

const categories = ['RESUME', 'COVER_LETTER', 'PORTFOLIO', 'CERTIFICATE', 'TRANSCRIPT', 'REFERENCE', 'OTHER'];

export default function FileFilters({ 
  selectedCategory, 
  searchTerm, 
  onCategoryChange, 
  onSearchChange 
}: FileFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="ALL">All Files</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
          ))}
        </select>
      </div>
      
      <input
        type="text"
        placeholder="Search files..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border rounded px-3 py-1 flex-1 max-w-xs text-sm"
      />
    </div>
  );
}
