import { useState, useEffect } from "react";
import BlogGrid from "./components/blogGrid";
import BlogSearch from "./components/blogSearch";
import BlogSlider from "./components/blogSlider";
import BlogCategories from "./components/blogCategories";
import BlogRecentPosts from "./components/blogRecentPosts";
import { useBlogs } from "./hooks/useClientBlog";

import "./styles/blogPropouse.css";

export default function BlogPropouse() {
    const { blogs, isLoading, error } = useBlogs();
    const [filteredBlogs, setFilteredBlogs] = useState([]);

    useEffect(() => {
        setFilteredBlogs(blogs);
    }, [blogs]);

    const handleFilterChange = ({ selectedCategories, selectedAuthors, startDate, endDate }) => {
        const results = blogs.filter(blog => {
            const matchesCategory = selectedCategories.length ? selectedCategories.includes(blog.category) : true;
            const matchesAuthor = selectedAuthors.length ? selectedAuthors.includes(blog.author) : true;
            const matchesStartDate = startDate ? new Date(blog.createdAt) >= new Date(startDate) : true;
            const matchesEndDate = endDate ? new Date(blog.createdAt) <= new Date(endDate) : true;

            return matchesCategory && matchesAuthor && matchesStartDate && matchesEndDate;
        });

        setFilteredBlogs(results);
    };

    const handleCategoryClick = (categoryId) => {
        const filteredByCategory = blogs.filter(blog => blog.categoryId === categoryId);
        setFilteredBlogs(filteredByCategory);
    };

    const handleSearchResults = (results) => {
        setFilteredBlogs(results);
    };

    return (
        <section className="tech-blog-app">
            <BlogSlider />

            <main className="tech-blog-main">
                <div className="p-blog-left-side">
                    <BlogSearch blogs={blogs} onSearch={handleSearchResults} />
                    <BlogCategories   posts={blogs} onFilterChange={handleFilterChange} onCategoryClick={handleCategoryClick} />
                    <BlogRecentPosts />
                </div>

                <div className="p-blog-right-side">
                    {isLoading && <div>Cargando blogs...</div>}
                    {error && <div>{error}</div>}
                    {!isLoading && !error && <BlogGrid blogs={filteredBlogs} />}
                </div>
            </main>
        </section>
    );
}
