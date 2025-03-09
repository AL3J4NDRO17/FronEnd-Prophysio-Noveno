import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BlogSkeleton = () => {
    return (
        <div className="blog-skeleton">
           
            <div className="blog-skeleton__table">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="blog-skeleton__row" >
                        <Skeleton height={10} width="100%" />
                        <Skeleton height={20} width="100%" />
                        <Skeleton height={20} width="100%" />
                        <Skeleton height={20} width="100%" />
                        <Skeleton height={20} width="100%" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogSkeleton;
