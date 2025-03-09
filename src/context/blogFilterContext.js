import { createContext, useState, useContext } from 'react';

const BlogFilterContext = createContext();

export const useBlogFilter = () => useContext(BlogFilterContext);

export const BlogFilterProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        selectedCategories: [],
        selectedAuthors: [],
        startDate: null,
        endDate: null,
        searchQuery: "",
    });

    return (
        <BlogFilterContext.Provider value={{ filters, setFilters }}>
            {children}
        </BlogFilterContext.Provider>
    );
};
