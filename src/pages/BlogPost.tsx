
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { blogPosts } from '@/utils/blogData';
import { Helmet } from 'react-helmet';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);
  
  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <Link to="/blog" className="flex items-center text-zodiac-stardust-gold hover:underline">
          <ArrowLeft size={16} className="mr-2" /> Back to all posts
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{post.title} | Zodible - Astrology Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} | Zodible`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta name="keywords" content={post.tags.join(', ')} />
      </Helmet>
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Link to="/blog" className="flex items-center text-zodiac-stardust-gold hover:underline mb-4">
          <ArrowLeft size={16} className="mr-2" /> Back to all posts
        </Link>
        
        <article className="glass p-6 rounded-xl">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-400 mb-6 gap-4">
            <div className="flex items-center">
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <span>{post.readingTime} min read</span>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none mb-8">
            {post.content.map((paragraph, index) => (
              <p key={index} className="mb-4 text-white/90">{paragraph}</p>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-8">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </article>
      </div>
    </>
  );
};

export default BlogPost;
