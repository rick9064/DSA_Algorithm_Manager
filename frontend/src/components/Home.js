import React from 'react';
import { Code2, Search, ArrowUpDown, List, Zap, BookOpen, Trophy } from 'lucide-react';

function Home() {
  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Search Algorithms",
      description: "Master binary search, linear search, and advanced searching techniques"
    },
    {
      icon: <ArrowUpDown className="w-8 h-8" />,
      title: "Sorting Algorithms", 
      description: "Learn bubble sort, merge sort, quick sort, and more sorting methods"
    },
    {
      icon: <List className="w-8 h-8" />,
      title: "Queue Operations",
      description: "Understand FIFO operations, priority queues, and circular queues"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-spin duration-[20s]"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-6 pt-20 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Code2 className="w-12 h-12 text-cyan-400 mr-4 animate-bounce" />
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                DSA
              </h1>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Algorithm Manager
              <span className="block text-2xl md:text-3xl text-purple-300 font-normal mt-2">
                Master Data Structures & Algorithms
              </span>
            </h2>

            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              Dive into the world of algorithms with our interactive platform. Learn, practice, and master essential DSA concepts through hands-on experience and visual demonstrations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25">
                <span className="relative z-10 flex items-center justify-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Learning
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </button>
              
              <button className="px-8 py-4 border-2 border-purple-400 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-purple-400/10 hover:scale-105 hover:shadow-lg hover:shadow-purple-400/25">
                <BookOpen className="w-5 h-5 mr-2 inline" />
                View Documentation
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-500 hover:bg-white/10 hover:border-purple-400/50 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center mt-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                    <span className="text-sm font-medium mr-2">Explore</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-400/30 rounded-full mb-6">
              <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-sm font-medium">Ready to become an algorithm expert?</span>
            </div>
            
            <h3 className="text-3xl font-bold mb-4">
              Select an algorithm from the navigation bar to get started!
            </h3>
            <p className="text-slate-400 text-lg">
              Join thousands of developers mastering DSA concepts
            </p>
          </div>
        </div>

        <div className="absolute top-20 left-10 opacity-20 font-mono text-sm text-cyan-400 animate-pulse">
          {"while(true) {"}
        </div>
        <div className="absolute top-40 right-20 opacity-20 font-mono text-sm text-purple-400 animate-pulse delay-500">
          {"arr.sort()"}
        </div>
        <div className="absolute bottom-40 left-20 opacity-20 font-mono text-sm text-pink-400 animate-pulse delay-1000">
          {"O(log n)"}
        </div>
        <div className="absolute bottom-20 right-10 opacity-20 font-mono text-sm text-cyan-400 animate-pulse delay-1500">
          {"return result;"}
        </div>
      </div>
    </div>
  );
}

export default Home;