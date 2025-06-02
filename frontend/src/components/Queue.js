import React, { useState, useEffect } from 'react';
import { Plus, Minus, Code2, Play, RotateCcw, ArrowRight, ArrowLeft, Zap, Clock, CheckCircle, AlertCircle, Copy, Eye, EyeOff } from 'lucide-react';

function Queue() {
  const [operation, setOperation] = useState('enqueue');
  const [value, setValue] = useState('');
  const [queueData, setQueueData] = useState([]);
  const [showCode, setShowCode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastOperation, setLastOperation] = useState('');
  const [operationHistory, setOperationHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  const handleQueue = async () => {
    if (operation === 'enqueue' && (!value || value.trim() === '')) {
      return;
    }

    setIsAnimating(true);
    setTimeout(() => {
      let newQueue = [...queueData];
      let operationResult = '';

      if (operation === 'enqueue') {
        newQueue.push(value.trim());
        operationResult = `Enqueued: ${value.trim()}`;
        setOperationHistory(prev => [...prev, { operation: 'enqueue', value: value.trim(), timestamp: Date.now() }]);
        setValue('');
      } else {
        if (newQueue.length > 0) {
          const dequeuedValue = newQueue.shift();
          operationResult = `Dequeued: ${dequeuedValue}`;
          setOperationHistory(prev => [...prev, { operation: 'dequeue', value: dequeuedValue, timestamp: Date.now() }]);
        } else {
          operationResult = 'Queue is empty - cannot dequeue';
        }
      }

      setQueueData(newQueue);
      setLastOperation(operationResult);
      setIsAnimating(false);
    }, 600);
  };

  const clearQueue = () => {
    setQueueData([]);
    setLastOperation('Queue cleared');
    setOperationHistory([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && operation === 'enqueue') {
      handleQueue();
    }
  };

  const copyCode = () => {
    const codeText = `class Queue:
    def __init__(self):
        self.queue = []
    
    def enqueue(self, value):
        """Add element to the rear of the queue - O(1)"""
        self.queue.append(value)
    
    def dequeue(self):
        """Remove element from the front of the queue - O(1)"""
        if self.is_empty():
            return "Queue is empty"
        return self.queue.pop(0)
    
    def front(self):
        """Get the front element without removing it"""
        if self.is_empty():
            return "Queue is empty"
        return self.queue[0]
    
    def is_empty(self):
        """Check if queue is empty"""
        return len(self.queue) == 0
    
    def size(self):
        """Get the size of the queue"""
        return len(self.queue)`;
        
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-spin duration-[20s]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <ArrowRight className="w-10 h-10 text-cyan-400 mr-3 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Queue Algorithm
            </h1>
            <ArrowLeft className="w-10 h-10 text-cyan-400 ml-3 animate-pulse" />
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Experience FIFO (First In, First Out) operations with interactive visualization
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Zap className="w-6 h-6 text-yellow-400 mr-2" />
              Queue Operations
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">Select Operation:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setOperation('enqueue')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                    operation === 'enqueue' 
                      ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300' 
                      : 'border-white/20 hover:border-cyan-400/50 hover:bg-cyan-400/5'
                  }`}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Enqueue
                </button>
                <button
                  onClick={() => setOperation('dequeue')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                    operation === 'dequeue' 
                      ? 'border-purple-400 bg-purple-400/10 text-purple-300' 
                      : 'border-white/20 hover:border-purple-400/50 hover:bg-purple-400/5'
                  }`}
                >
                  <Minus className="w-5 h-5 mr-2" />
                  Dequeue
                </button>
              </div>
            </div>
            {operation === 'enqueue' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">Value to Enqueue:</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter a value..."
                  className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                />
              </div>
            )}

            <div className="flex gap-3 mb-6">
              <button
                onClick={handleQueue}
                disabled={isAnimating || (operation === 'enqueue' && !value.trim())}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
              >
                {isAnimating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Execute {operation === 'enqueue' ? 'Enqueue' : 'Dequeue'}
                  </>
                )}
              </button>
              <button
                onClick={clearQueue}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Clear
              </button>
            </div>
            {lastOperation && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-green-300 font-medium">{lastOperation}</span>
              </div>
            )}
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <ArrowRight className="w-6 h-6 text-purple-400 mr-2" />
              Queue Visualization
            </h3>
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <span className="text-sm text-slate-400 mr-4">FRONT</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              
              <div className="flex flex-wrap gap-2 min-h-[80px] p-4 bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-600">
                {queueData.length === 0 ? (
                  <div className="flex items-center justify-center w-full text-slate-400">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Queue is empty
                  </div>
                ) : (
                  queueData.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className={`bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-500 transform ${
                        isAnimating && index === queueData.length - 1 && operation === 'enqueue'
                          ? 'scale-110 shadow-lg shadow-cyan-500/50'
                          : isAnimating && index === 0 && operation === 'dequeue'
                          ? 'scale-110 shadow-lg shadow-red-500/50'
                          : 'scale-100'
                      }`}
                    >
                      {item}
                    </div>
                  ))
                )}
              </div>
              
              <div className="flex items-center mt-4">
                <ArrowLeft className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400 ml-4">REAR</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">{queueData.length}</div>
                <div className="text-sm text-slate-400">Queue Size</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{operationHistory.length}</div>
                <div className="text-sm text-slate-400">Total Operations</div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-400/30 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="font-semibold text-yellow-300">Time Complexity</span>
              </div>
              <div className="text-sm text-slate-300">
                Enqueue: <span className="text-green-400 font-mono">O(1)</span> • 
                Dequeue: <span className="text-green-400 font-mono">O(1)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <Code2 className="w-6 h-6 text-cyan-400 mr-2" />
            Queue Algorithm Overview
          </h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 leading-relaxed mb-4">
              The Queue data structure follows the <strong className="text-cyan-400">FIFO (First In First Out)</strong> principle. 
              Elements are added to the rear (enqueue) and removed from the front (dequeue), similar to a real-world queue or line.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              Key characteristics include constant time complexity O(1) for both enqueue and dequeue operations, 
              making it highly efficient for scenarios requiring ordered processing of elements.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Common applications include task scheduling, breadth-first search algorithms, handling requests 
              in web servers, and managing resources in operating systems.
            </p>
          </div>
        </div>

        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Code2 className="w-6 h-6 text-yellow-400 mr-3" />
                <h3 className="text-2xl font-bold text-yellow-400">Algorithm Implementation</h3>
              </div>
              <div className="flex space-x-3">
                {showCode && (
                  <button
                    onClick={copyCode}
                    className="flex items-center px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm text-slate-300 hover:text-white transition-all duration-200"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  {showCode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showCode ? 'Hide Code' : 'Show Code'}
                </button>
              </div>
            </div>

            {showCode && (
              <div className="animate-slideDown">
                <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-slate-400">Python Implementation</span>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
                    <code>{`class Queue:
    def __init__(self):
        self.queue = []
    
    def enqueue(self, value):
        """Add element to the rear of the queue - O(1)"""
        self.queue.append(value)
    
    def dequeue(self):
        """Remove element from the front of the queue - O(1)"""
        if self.is_empty():
            return "Queue is empty"
        return self.queue.pop(0)
    
    def front(self):
        """Get the front element without removing it"""
        if self.is_empty():
            return "Queue is empty"
        return self.queue[0]
    
    def is_empty(self):
        """Check if queue is empty"""
        return len(self.queue) == 0
    
    def size(self):
        """Get the size of the queue"""
        return len(self.queue)`}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute top-20 left-10 opacity-20 font-mono text-sm text-cyan-400 animate-pulse">
        {"queue.enqueue()"}
      </div>
      <div className="absolute top-40 right-20 opacity-20 font-mono text-sm text-purple-400 animate-pulse delay-500">
        {"FIFO"}
      </div>
      <div className="absolute bottom-40 left-20 opacity-20 font-mono text-sm text-pink-400 animate-pulse delay-1000">
        {"O(1)"}
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 font-mono text-sm text-cyan-400 animate-pulse delay-1500">
        {"queue.dequeue()"}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 1000px; }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Queue;