# Pagination Component Usage Guide

## 📋 Overview

A reusable, professional pagination component for all dashboards (Customer, Driver, Admin, Area Manager).

## 🚀 Quick Setup

### 1. Import the Component

```javascript
import Pagination from '../../../components/Pagination';
```

### 2. Add State Variables

```javascript
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5; // Show 5 items per page
```

### 3. Add Pagination Logic

```javascript
// Filter your data first (if needed)
const filteredData = data.filter((item) => {
  // your filter logic
});

// Calculate pagination
const totalPages = Math.ceil(filteredData.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const paginatedData = filteredData.slice(startIndex, endIndex);

// Handle page changes
const handlePageChange = (page) => {
  setCurrentPage(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Reset page when filters change
const handleFilterChange = (filterValue) => {
  setYourFilter(filterValue);
  setCurrentPage(1); // Important: Reset to page 1
};
```

### 4. Use Paginated Data in Rendering

```javascript
// Change from:
{filteredData.map((item) => (
  // your item component
))}

// To:
{paginatedData.map((item) => (
  // your item component
))}
```

### 5. Add Pagination Component

```javascript
{
  /* After your data list */
}
{
  filteredData.length > 0 && (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
    />
  );
}
```

## 📊 Component Props

| Prop           | Type     | Required | Description                |
| -------------- | -------- | -------- | -------------------------- |
| `currentPage`  | number   | Yes      | Current active page number |
| `totalPages`   | number   | Yes      | Total number of pages      |
| `onPageChange` | function | Yes      | Callback when page changes |
| `itemsPerPage` | number   | Yes      | Number of items per page   |
| `totalItems`   | number   | Yes      | Total number of items      |

## 🎨 Features

✅ **Responsive Design** - Works on mobile, tablet, and desktop
✅ **Professional Look** - Matches M19 Logistics branding with teal colors
✅ **Smart Page Numbers** - Shows ellipsis (...) for large page counts
✅ **Accessibility** - ARIA labels and keyboard navigation
✅ **Smooth Scrolling** - Auto-scroll to top on page change
✅ **Previous/Next Buttons** - With disabled states
✅ **Item Count Display** - Shows "Showing X to Y of Z results"

## 📱 Responsive Breakpoints

- **Mobile**: Compact buttons, icons only for Prev/Next
- **Tablet/Desktop**: Full text labels with icons

## 🔧 Customization

### Change Items Per Page

```javascript
const itemsPerPage = 10; // Change to 10, 15, 20, etc.
```

### Custom Styling

The component uses Tailwind CSS. Edit [Pagination.jsx](src/components/Pagination.jsx) to customize:

- Colors: Change `teal-*` to your preferred color
- Button sizes: Adjust `h-9 w-9`, `px-3`, `py-2`
- Borders: Modify `border`, `rounded-lg`

## 📍 Implementation Example (Customer Dashboard)

See [CustomerDashboardHome.jsx](src/pages/dashboards/customer/CustomerDashboardHome.jsx) for a complete working example.

## 🎯 Best Practices

1. **Always reset page to 1** when filters change
2. **Show pagination only if** items exist (`{data.length > 0 && <Pagination />}`)
3. **Use smooth scrolling** for better UX
4. **Keep itemsPerPage consistent** across similar dashboards (recommend 5-10)
5. **Handle empty states** before pagination

## 🚨 Common Issues

### Issue: Page doesn't reset when filter changes

**Solution:** Use `handleFilterChange` function that sets page to 1

### Issue: Wrong items showing

**Solution:** Make sure you're using `paginatedData.map()` not `filteredData.map()`

### Issue: Pagination shows when no items

**Solution:** Add condition `{filteredData.length > 0 && <Pagination />}`

## 📝 Implementation Checklist

- [ ] Import Pagination component
- [ ] Add state: `currentPage`, `itemsPerPage`
- [ ] Add pagination logic (totalPages, slice data)
- [ ] Create `handlePageChange` function
- [ ] Update filter handlers to reset page
- [ ] Use `paginatedData` in rendering
- [ ] Add Pagination component below list
- [ ] Test page navigation
- [ ] Test filter changes
- [ ] Test empty states

## 🎉 Ready to Use

This pagination component is production-ready and can be copied to:

- Driver Dashboard
- Admin Dashboard
- Area Manager Dashboard
- Any other data listing pages

Just follow the Quick Setup steps above!
