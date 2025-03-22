
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { blogPosts } from '@/utils/blogData';
import { Helmet } from 'react-helmet';

const BlogPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = blogPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(blogPosts);
    }
  }, [searchTerm]);

  // Single post view
  if (slug) {
    const post = blogPosts.find(p => p.slug === slug);
    
    if (!post) {
      return (
        <div className="max-w-4xl mx-auto py-8">
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
        
        <div className="max-w-4xl mx-auto py-8">
          <Link to="/blog" className="flex items-center text-zodiac-stardust-gold hover:underline mb-4">
            <ArrowLeft size={16} className="mr-2" /> Back to all posts
          </Link>
          
          <article>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center text-sm text-gray-400 mb-6">
              <div className="flex items-center mr-4">
                <Calendar size={14} className="mr-1" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center mr-4">
                <User size={14} className="mr-1" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{post.readingTime} min read</span>
              </div>
            </div>
            
            <div className="prose prose-invert max-w-none mb-8">
              {post.content.map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
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
  }
  
  // Blog listing page
  return (
    <>
      <Helmet>
        <title>Astrology Blog | Zodible</title>
        <meta name="description" content="Explore the cosmic wisdom of astrology in our blog. Discover horoscopes, zodiac sign compatibility, planetary influences, and spiritual guidance." />
        <meta property="og:title" content="Astrology Blog | Zodible" />
        <meta property="og:description" content="Explore the cosmic wisdom of astrology in our blog. Discover horoscopes, zodiac sign compatibility, planetary influences, and spiritual guidance." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="astrology blog, horoscope blog, zodiac signs, astrology articles, moon phases, planetary transits, birth chart" />
      </Helmet>
      
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Astrology Blog
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Explore the cosmic wisdom of astrology in our blog. Discover horoscopes, 
            zodiac sign compatibility, planetary influences, and spiritual guidance.
          </p>
        </div>
        
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-zodiac-stardust-gold/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="glass p-6 rounded-xl hover:bg-white/5 transition-colors">
              <div className="flex flex-col h-full">
                <h2 className="text-xl font-bold mb-2 hover:text-zodiac-stardust-gold transition-colors">
                  {post.title}
                </h2>
                <p className="text-white/70 mb-4 flex-grow">{post.excerpt}</p>
                <div className="flex justify-between items-center text-sm text-white/60">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>{post.date}</span>
                  </div>
                  <span>{post.readingTime} min read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default BlogPage;
