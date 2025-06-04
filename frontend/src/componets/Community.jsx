import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Filter, Heart, MessageSquare, Send, X, Hash, Image, Calendar, Paperclip, Smile, ChevronDown, User, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const popularTags = [
  "#career", "#tech", "#conferences", "#mentorship", "#finance", "#careers",
  "#networking", "#events", "#austin", "#marketing", "#trends", "#digital",
  "#design", "#collaboration", "#ux"
];

const CommunityFeed = () => {
  const navigate = useNavigate();
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const postInputRef = useRef(null);
  const filterRef = useRef(null);

  const handleBackButton = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://alumini-connect-backend.vercel.app/api/messages/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch messages');

        const data = await res.json();

        const mappedPosts = data.map(msg => ({
          id: msg._id,
          author: msg.sender?.name || "Anonymous",
          avatar: msg.sender?.name?.charAt(0).toUpperCase() || "A",
          title: msg.sender?.jobTitle || "Alumni",
          content: msg.content,
          tags: msg.tags || [],
          likes: msg.likes || 0,
          liked: false,
          comments: msg.comments || [],
          date: new Date(msg.createdAt).toLocaleString(),
          saved: false
        }));

        // Sample posts for the demonstration
        const samplePosts = [
          {
            id: 'michael-chen-001',
            author: 'Michael Chen',
            avatar: 'M',
            title: 'Investment Analyst at Global Finance Partners',
            content: 'Looking for recent graduates interested in finance to join our mentorship program at Global Finance Partners. Great opportunity to network and develop your skills!',
            tags: ['#mentorship', '#finance', '#careers'],
            likes: 24,
            liked: false,
            comments: [
              { author: 'Sarah Johnson', content: 'Is this open to non-finance majors as well?', date: '20 min ago' },
              { author: 'Michael Chen', content: 'Absolutely! We welcome diverse backgrounds.', date: '15 min ago' }
            ],
            date: 'May 14, 2023 at 03:45 PM',
            saved: false
          },
          {
            id: 'jane-smith-002',
            author: 'Jane Smith',
            avatar: 'J',
            title: 'UX Designer at TechDesign Studios',
            content: 'Just published an article about design systems and their impact on product development. Would love to hear thoughts from fellow designers in our alumni network!',
            tags: ['#design', '#ux', '#tech'],
            likes: 15,
            liked: false,
            comments: [
              { author: 'Alex Wong', content: 'Great article! Could you share the link?', date: '1 hour ago' }
            ],
            date: 'May 12, 2023 at 10:22 AM',
            saved: true
          }
        ];

        setPosts([...samplePosts, ...mappedPosts]);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // Close filter dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTagKeyDown = (e) => {
    const newTag = tagInput.trim();
    if (e.key === 'Enter' && newTag !== '') {
      e.preventDefault();
      if (!newTag.startsWith('#')) {
        const formattedTag = `#${newTag}`;
        if (!tags.includes(formattedTag)) {
          setTags([...tags, formattedTag]);
        }
      } else if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handlePost = async () => {
    if (!postText.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) return alert("User not authenticated");

    const newPost = { content: postText, tags };

    try {
      const res = await fetch('https://alumini-connect-backend.vercel.app/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPost),
      });

      if (!res.ok) throw new Error('Failed to post message');

      const result = await res.json();

      const frontendPost = {
        id: result._id || Date.now(),
        author: "You",
        avatar: "Y",
        title: "Alumni Member",
        content: postText,
        tags,
        likes: 0,
        liked: false,
        comments: [],
        date: new Date().toLocaleString(),
        saved: false
      };

      setPosts([frontendPost, ...posts]);
      setPostText('');
      setTags([]);
    } catch (err) {
      console.error(err);
      alert('Error posting message');
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleSave = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, saved: !post.saved }
        : post
    ));
  };

  const focusPostInput = () => {
    postInputRef.current?.focus();
  };

  const filteredPosts = posts.filter(post => {
    // Apply search filter
    const matchesSearch = search ? 
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())) ||
      post.author.toLowerCase().includes(search.toLowerCase())
      : true;
    
    // Apply category filter
    let matchesFilter = true;
    if (filter === 'popular') {
      matchesFilter = post.likes > 10;
    } else if (filter === 'saved') {
      matchesFilter = post.saved;
    } else if (filter === 'discussions') {
      matchesFilter = (post.comments?.length || 0) > 0;
    }
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 pt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Feed</h1>
          <p className="mt-1 text-gray-600">Share updates and connect with fellow alumni</p>
        </div>
        
        <button
          onClick={handleBackButton}
          className="mt-4 sm:mt-0 flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>

      {/* Create Post Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 pb-0">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
              Y
            </div>
            <div 
              className="flex-1 min-h-[80px] px-3 py-2 bg-gray-50 rounded-lg cursor-text"
              onClick={focusPostInput}
            >
              <textarea
                ref={postInputRef}
                className="w-full bg-transparent resize-none outline-none text-gray-700 placeholder-gray-500"
                placeholder="Share something with the alumni community..."
                rows={3}
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
              />
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-sm">
                      {tag}
                      <button 
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <button className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors">
              <Image className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="relative">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tags..."
                className="pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <Hash className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          <button
            onClick={handlePost}
            disabled={!postText.trim()}
            className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm ${
              postText.trim() 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4 mr-2" />
            Post
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search posts, tags, or people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="relative" ref={filterRef}>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 min-w-[120px]"
          >
            <Filter className="w-4 h-4 mr-2 text-gray-500" />
            <span>{filter === 'all' ? 'All Posts' : filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
            <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
          </button>
          
          {showFilters && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button 
                  onClick={() => {setFilter('all'); setShowFilters(false);}}
                  className={`flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${filter === 'all' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                >
                  All Posts
                </button>
                <button 
                  onClick={() => {setFilter('popular'); setShowFilters(false);}}
                  className={`flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${filter === 'popular' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                >
                  <Heart className="w-4 h-4 mr-2 text-gray-500" />
                  Popular
                </button>
                <button 
                  onClick={() => {setFilter('discussions'); setShowFilters(false);}}
                  className={`flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${filter === 'discussions' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                >
                  <MessageSquare className="w-4 h-4 mr-2 text-gray-500" />
                  Discussions
                </button>
                <button 
                  onClick={() => {setFilter('saved'); setShowFilters(false);}}
                  className={`flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${filter === 'saved' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                >
                  <Bookmark className="w-4 h-4 mr-2 text-gray-500" />
                  Saved
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popular Tags */}
      <div className="mb-6 overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <Hash className="w-4 h-4 text-gray-500" />
          <p className="text-sm font-medium text-gray-700">Trending topics</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularTags.slice(0, 8).map(tag => (
            <button
              key={tag}
              onClick={() => setSearch(tag)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                search === tag
                  ? 'bg-blue-100 text-blue-800 border border-blue-200 font-medium'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tag}
            </button>
          ))}
          <button className="px-3 py-1.5 rounded-full text-sm border border-gray-200 text-gray-700 hover:bg-gray-100">
            More...
          </button>
        </div>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No posts found</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-4">
            {search ? 
              `We couldn't find any posts matching "${search}". Try a different search term.` :
              "There are no posts matching your current filter. Try a different filter or create the first post!"
            }
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Post Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium shadow-sm">
                    {post.avatar}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{post.author}</h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{post.title}</span>
                      <span className="mx-1.5">•</span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {post.date.split(' at')[0]}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
              
              {/* Post Content */}
              <div className="px-4 pb-3">
                <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
              </div>
              
              {/* Post Tags */}
              {post.tags?.length > 0 && (
                <div className="px-4 pb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setSearch(tag)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-2.5 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Post Stats */}
              <div className="px-4 py-2 border-t border-gray-100 text-sm text-gray-500 flex justify-between">
                <div className="flex space-x-4">
                  <span className="flex items-center">
                    <Heart className={`w-4 h-4 mr-1.5 ${post.liked ? 'text-red-500 fill-red-500' : ''}`} />
                    {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                  </span>
                  <span className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1.5" />
                    {post.comments?.length || 0} {post.comments?.length === 1 ? 'comment' : 'comments'}
                  </span>
                </div>
                {post.saved && (
                  <span className="flex items-center text-blue-600">
                    <Bookmark className="w-4 h-4 mr-1.5 fill-blue-600" />
                    Saved
                  </span>
                )}
              </div>
              
              {/* Post Actions */}
              <div className="flex border-t border-gray-100 divide-x divide-gray-100">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center justify-center gap-2 flex-1 py-3 font-medium text-sm hover:bg-gray-50 transition-colors ${
                    post.liked ? 'text-red-500' : 'text-gray-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.liked ? 'fill-red-500' : ''}`} />
                  Like
                </button>
                <button className="flex items-center justify-center gap-2 flex-1 py-3 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  Comment
                </button>
                <button
                  onClick={() => handleSave(post.id)}
                  className={`flex items-center justify-center gap-2 flex-1 py-3 font-medium text-sm hover:bg-gray-50 transition-colors ${
                    post.saved ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${post.saved ? 'fill-blue-600' : ''}`} />
                  {post.saved ? 'Saved' : 'Save'}
                </button>
              </div>
              
              {/* Comments Section */}
              {post.comments?.length > 0 && (
                <div className="border-t border-gray-100 bg-gray-50 p-4">
                  {post.comments.map((comment, idx) => (
                    <div key={idx} className={`flex space-x-3 ${idx > 0 ? 'mt-4' : ''}`}>
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-medium text-sm">
                        {comment.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-sm text-gray-900">{comment.author}</span>
                            <span className="text-xs text-gray-500">{comment.date}</span>
                          </div>
                          <p className="text-sm text-gray-800">{comment.content}</p>
                        </div>
                        <div className="flex items-center mt-1 ml-1 space-x-4 text-xs text-gray-500">
                          <button className="hover:text-gray-700">Like</button>
                          <button className="hover:text-gray-700">Reply</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Comment input */}
                  <div className="flex items-center space-x-3 mt-4 pt-3 border-t border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-medium text-sm">
                      Y
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-full bg-white text-sm"
                      />
                      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {filteredPosts.length > 5 && (
        <div className="flex justify-center mt-8">
          <button className="px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 font-medium flex items-center">
            Load more posts
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;