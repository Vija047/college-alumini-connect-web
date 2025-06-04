
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, MapPin, Briefcase, Calendar, Filter, X, Linkedin, ChevronDown } from 'lucide-react';

const AlumniDirectory = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    year: '',
    major: '',
    location: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await fetch('https://alumini-connect-backend.vercel.app/api/users/directory');
        const data = await res.json();
        setAlumni(data);
      } catch (err) {
        console.error('Failed to fetch alumni:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  const handleBackButton = () => {
    navigate('/');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      year: '',
      major: '',
      location: ''
    });
  };

  const toggleFilters = () => {
    setFilterOpen(!filterOpen);
  };

  const filteredAlumni = alumni.filter((user) => {
    const combinedString = `${user.name || ''} ${user.jobTitle || ''} ${user.location || ''} ${user.branch || ''} ${user.tags?.join(' ') || ''}`.toLowerCase();
    
    // Apply search term filter
    const matchesSearch = searchTerm ? combinedString.includes(searchTerm) : true;
    
    // Apply dropdown filters
    const matchesYear = filters.year ? String(user.batch) === filters.year : true;
    const matchesMajor = filters.major ? user.branch === filters.major : true;
    const matchesLocation = filters.location 
      ? (user.location || '').toLowerCase().includes(filters.location.toLowerCase()) 
      : true;
    
    return matchesSearch && matchesYear && matchesMajor && matchesLocation;
  });

  // Extract unique values for filters
  const years = [...new Set(alumni.map(a => a.batch).filter(Boolean))];
  const majors = [...new Set(alumni.map(a => a.branch).filter(Boolean))];

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alumni Directory</h1>
            <p className="mt-2 text-gray-600">Connect with fellow alumni and expand your professional network.</p>
          </div>
          
          <button
            onClick={handleBackButton}
            className="flex items-center mt-4 md:mt-0 text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
        
        {/* Search and filter bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search alumni by name, job, skills..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="md:hidden">
              <button 
                onClick={toggleFilters}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filters {Object.values(filters).some(v => v) && "(Applied)"}
              </button>
            </div>
            
            <div className="hidden md:flex md:items-center md:gap-4">
              <select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="block w-32 py-3 px-4 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Year</option>
                {years.sort((a, b) => b - a).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              
              <select
                name="major"
                value={filters.major}
                onChange={handleFilterChange}
                className="block w-48 py-3 px-4 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Major</option>
                {majors.map(major => (
                  <option key={major} value={major}>{major}</option>
                ))}
              </select>
              
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={filters.location}
                onChange={handleFilterChange}
                className="block w-40 py-3 px-4 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
              />
              
              {Object.values(filters).some(v => v) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center justify-center text-sm text-gray-700 hover:text-blue-600"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </button>
              )}
            </div>
          </div>
          
          {/* Mobile filters (collapsible) */}
          {filterOpen && (
            <div className="mt-4 pt-4 border-t border-gray-200 md:hidden">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                  <select
                    name="year"
                    value={filters.year}
                    onChange={handleFilterChange}
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Any Year</option>
                    {years.sort((a, b) => b - a).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Major/Branch</label>
                  <select
                    name="major"
                    value={filters.major}
                    onChange={handleFilterChange}
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Any Major</option>
                    {majors.map(major => (
                      <option key={major} value={major}>{major}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="City, State, or Country"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={clearFilters}
                    className="w-1/2 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={toggleFilters}
                    className="w-1/2 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          {loading ? (
            <div className="flex items-center">
              <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
              <p className="text-gray-600">Loading alumni...</p>
            </div>
          ) : (
            <p className="text-gray-600">
              {filteredAlumni.length === 0 ? (
                'No alumni found matching your criteria'
              ) : (
                `Showing ${filteredAlumni.length} ${filteredAlumni.length === 1 ? 'alumnus' : 'alumni'}`
              )}
            </p>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select className="text-sm border-0 font-medium text-gray-700 focus:ring-0">
              <option>Recent</option>
              <option>Name</option>
              <option>Year</option>
            </select>
          </div>
        </div>
        
        {/* Alumni grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gray-200 mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-24 mb-4"></div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAlumni.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No alumni found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any alumni matching your search criteria. Try adjusting your filters or search term.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((user) => (
              <div key={user._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                <div className="p-6 pt-0 relative">
                  <div className="flex flex-col items-center -mt-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 border-4 border-white flex items-center justify-center text-xl font-bold text-white">
                      {user.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-gray-900">{user.name || 'No Name'}</h3>
                    {user.jobTitle && (
                      <div className="flex items-center text-sm text-gray-700 mt-1">
                        <Briefcase className="w-3.5 h-3.5 mr-1 text-gray-500" />
                        {user.jobTitle}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {user.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-500 flex-shrink-0" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-500 flex-shrink-0" />
                      <span>
                        {user.branch || 'N/A'} {user.batch ? `• Class of ${user.batch}` : ''}
                      </span>
                    </div>
                  </div>
                  
                  {user.tags?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium uppercase text-gray-500 mb-1.5">Skills & Interests</p>
                      <div className="flex flex-wrap gap-1.5">
                        {user.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                        {user.tags.length > 3 && (
                          <span className="bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium">
                            +{user.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                    {user.linkedin ? (
                      <a
                        href={user.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <Linkedin className="w-4 h-4 mr-1.5" />
                        LinkedIn Profile
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">No LinkedIn profile</span>
                    )}
                    
                    <button className="text-sm text-gray-500 hover:text-blue-600 font-medium">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {filteredAlumni.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-1">
              <button className="p-2 border rounded hover:bg-gray-50 text-gray-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="px-3 py-1.5 border rounded bg-blue-600 text-white font-medium">1</button>
              <button className="px-3 py-1.5 border rounded hover:bg-gray-50 text-gray-700">2</button>
              <button className="px-3 py-1.5 border rounded hover:bg-gray-50 text-gray-700">3</button>
              <span className="px-2 text-gray-500">...</span>
              <button className="px-3 py-1.5 border rounded hover:bg-gray-50 text-gray-700">12</button>
              <button className="p-2 border rounded hover:bg-gray-50 text-gray-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniDirectory;