"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import "./carrousel.css"
export default function Carousel({ posts }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length)
  }

  return (
    <div className="related-posts">
      <h2 className="related-posts-title">Related Blog Posts</h2>
      <div className="related-posts-container">
        <button onClick={prevSlide} className="nav-button nav-button-left">
          <ChevronLeft className="nav-icon" />
        </button>
        <div className="posts-grid">
          {posts.slice(currentIndex, currentIndex + 3).map((post) => (
            <Link to={`/blog/${post.id}`} key={post.id} className="post-card">
              <div className="post-image-container">
                <img src={post.bannerImage || "/placeholder.svg"} alt={post.title} className="post-image" />
              </div>
              <div className="post-content">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{post.mainContent?.substring(0, 100)}...</p>
                <span className="read-more">Read more</span>
              </div>
            </Link>
          ))}
        </div>
        <button onClick={nextSlide} className="nav-button nav-button-right">
          <ChevronRight className="nav-icon" />
        </button>
      </div>
    </div>
  )
}

