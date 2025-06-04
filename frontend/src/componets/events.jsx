import { useState } from "react";
import { CalendarDays, MapPin, ChevronLeft, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const events = [
  {
    title: "RRR: Recruitment, Reunion & Recognition!",
    date: "Mar 01, 2025 – 10:30 AM",
    location: "Bangalore Central Campus, Bangalore",
    image: "/api/placeholder/400/240",
    isPast: true,
    category: "Networking"
  },
  {
    title: "Charter Connect 2.0 - Reunite and Recalibrate",
    date: "Nov 30, 2024",
    location: "Bangalore Central Campus, Bangalore",
    image: "/api/placeholder/400/240",
    isPast: true,
    category: "Alumni"
  },
  {
    title: "Tech Talk - AI in 2025",
    date: "Feb 15, 2025 – 11:00 AM",
    location: "Bangalore Central Campus, Bangalore",
    image: "/api/placeholder/400/240",
    isPast: true,
    category: "Technology"
  },
  {
    title: "Innovators Meet & Greet",
    date: "Jan 20, 2025 – 03:00 PM",
    location: "Bangalore Central Campus, Bangalore",
    image: "/api/placeholder/400/240",
    isPast: true,
    category: "Networking"
  },
  {
    title: "Startup Success Stories",
    date: "Dec 10, 2024 – 04:00 PM",
    location: "Bangalore Central Campus, Bangalore",
    image: "/api/placeholder/400/240",
    isPast: true,
    category: "Business"
  },
  {
    title: "Legacy Alumni Evening",
    date: "Oct 18, 2024 – 06:00 PM",
    location: "Bangalore Central Campus, Bangalore",
    image: "/api/placeholder/400/240",
    isPast: true,
    category: "Alumni"
  },
];

export default function EventsPage() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const navigate = useNavigate();

  const handleBackButton = () => {
    navigate("/");
  };

  const filteredEvents = events.filter((event) => {
    // Apply category filter
    const categoryMatch = 
      filter === "all" || 
      (filter === "past" && event.isPast) || 
      (filter === "upcoming" && !event.isPast);
    
    // Apply search filter
    const searchMatch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  const countByStatus = {
    all: events.length,
    past: events.filter(e => e.isPast).length,
    upcoming: events.filter(e => !e.isPast).length
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={handleBackButton}
                className="mr-4 flex items-center text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="ml-1 font-medium">Back</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Events</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <button 
                onClick={() => setMobileFilterOpen(true)}
                className="md:hidden p-2 rounded-full bg-gray-100 text-gray-600"
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
        {/* Mobile search */}
        <div className="md:hidden mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        {/* Filter sidebar */}
        <div className={`${mobileFilterOpen ? 'block' : 'hidden'} md:block fixed md:static top-0 left-0 h-full md:h-auto z-50 md:z-0 w-full md:w-64 bg-white md:bg-transparent transition-all duration-300 md:mr-8`}>
          <div className="md:hidden flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold">Filters</h2>
            <button onClick={() => setMobileFilterOpen(false)} className="text-gray-500">
              ✕
            </button>
          </div>
          
          <div className="p-4 md:p-0">
            <div className="md:sticky md:top-24">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    filter === "all" ? "bg-blue-50 text-blue-800 font-medium" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setFilter("all")}
                >
                  All Events 
                  <span className="float-right bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                    {countByStatus.all}
                  </span>
                </button>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    filter === "past" ? "bg-blue-50 text-blue-800 font-medium" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setFilter("past")}
                >
                  Past Events 
                  <span className="float-right bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                    {countByStatus.past}
                  </span>
                </button>
                <button
                  className={`w-full text-left p-3 rounded-lg transition ${
                    filter === "upcoming" ? "bg-blue-50 text-blue-800 font-medium" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setFilter("upcoming")}
                >
                  Upcoming Events 
                  <span className="float-right bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                    {countByStatus.upcoming}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
                >
                  <div className="h-48 bg-gray-200 relative">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <span className="inline-block bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{event.title}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarDays className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
                        event.isPast 
                          ? "bg-gray-100 text-gray-700" 
                          : "bg-green-100 text-green-800"
                      }`}>
                        {event.isPast ? "Past Event" : "Upcoming"}
                      </span>
                      <button className="bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium px-4 py-2 rounded-lg">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No events found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile filter toggle button */}
      <div className="md:hidden fixed bottom-6 right-6">
        <button 
          onClick={() => setMobileFilterOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          <Filter className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
