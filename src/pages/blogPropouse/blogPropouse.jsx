import { useState, useEffect } from "react";
import BlogGrid from "./utils/blogGrid";
import BlogSearch from "./utils/blogSearch";
import BlogSlider from "./utils/blogSlider";
import BlogCategories from "./utils/blogCategories";
import BlogRecentPosts from "./utils/blogRecentPosts";
import BlogFilters from "./utils/blogFilters";
import { useBlogs } from "./hooks/useClientBlog";

import "./styles/blogPropouse.css";

export default function BlogPropuse() {
    const { blogs, isLoading, error } = useBlogs();
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        setFilteredBlogs(blogs);
        setSearchResults(blogs);
    }, [blogs]);

    const handleFilterChange = ({ selectedCategories, selectedAuthors, startDate, endDate }) => {
        let results = blogs;

        if (selectedCategories.length) {
            results = results.filter(blog => selectedCategories.includes(blog.category));
        }

        if (selectedAuthors.length) {
            results = results.filter(blog => selectedAuthors.includes(blog.author));
        }

        if (startDate) {
            results = results.filter(blog => new Date(blog.createdAt) >= new Date(startDate));
        }

        if (endDate) {
            results = results.filter(blog => new Date(blog.createdAt) <= new Date(endDate));
        }

        setFilteredBlogs(results);
        setSearchResults(results);
    };

    const handleCategoryClick = (categoryName) => {
        console.log(categoryName)
        console.log(blogs)
        const filteredByCategory = blogs.filter(blog => blog.categoryId === categoryName);

        setFilteredBlogs(filteredByCategory);
        setSearchResults(filteredByCategory);
    };
    const handleSearchResults = (results) => {
        setFilteredBlogs(results)
    }

    return (
        <section className="tech-blog-app">
            <BlogSlider />

            <main className="tech-blog-main">
                <div className="p-blog-left-side">
                    <BlogSearch blogs={blogs} onSearch={handleSearchResults} />
                    <BlogCategories onCategoryClick={handleCategoryClick} />
                    <BlogFilters posts={blogs} onFilterChange={handleFilterChange} />

                    <BlogRecentPosts />
                </div>
                <div className="p-blog-right-side">
                    {isLoading ? (
                        <div>Cargando blogs...</div>
                    ) : error ? (
                        <div>{error}</div>
                    ) : (
                        <BlogGrid blogs={filteredBlogs} />

                    )}
                </div>
            </main>
        </section>
    );
}
