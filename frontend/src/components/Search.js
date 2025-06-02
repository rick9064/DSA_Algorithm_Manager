import React, { useState } from 'react';
import { Search as SearchIcon, Play, Code, Info, CheckCircle, AlertCircle, Copy, Eye, EyeOff, Target } from 'lucide-react';

const Search = () => {
    const [array, setArray] = useState('');
    const [target, setTarget] = useState('');
    const [result, setResult] = useState(null);
    const [showCode, setShowCode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleArrayChange = (e) => {
        setArray(e.target.value);
        if (error) setError('');
    };

    const handleTargetChange = (e) => {
        setTarget(e.target.value);
        if (error) setError('');
    };

    const handleSearch = async () => {
        if (!array.trim()) {
            setError('Please enter an array');
            return;
        }
        if (!target.trim()) {
            setError('Please enter a target value');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);
        
        try {
            const arrayValues = array.split(',').map((item) => {
                const parsed = parseFloat(item.trim());
                if (isNaN(parsed)) {
                    throw new Error('Invalid array values');
                }
                return parsed;
            });

            const targetValue = parseFloat(target);
            if (isNaN(targetValue)) {
                throw new Error('Invalid target value');
            }

            const response = await fetch('http://localhost:5000/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    array: arrayValues,
                    target: targetValue,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to connect to server');
            }

            const data = await response.json();
            
            if (data.error) {
                setError(data.error);
            } else {
                setResult({
                    found: data.found_at !== -1,
                    index: data.found_at,
                    array: arrayValues,
                    target: targetValue,
                    comparisons: arrayValues.length
                });
            }
        } catch (error) {
            console.error('Search error:', error);
            if (error.message === 'Invalid array values' || error.message === 'Invalid target value') {
                setError(error.message);
            } else {
                setError('Failed to connect to server. Please make sure the backend is running.');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleCode = () => {
        setShowCode(!showCode);
    };

    const copyCode = () => {
        const codeText = `def linear_search(arr, target):
    """
    Linear Search Algorithm
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    for index, value in enumerate(arr):
        if value == target:
            return index
    return -1

# Example usage
arr = [1, 3, 5, 7, 9, 11]
target = 7
result = linear_search(arr, target)
if result != -1:
    print(f"Target found at index: {result}")
else:
    print("Target not found in the array")`;
        
        navigator.clipboard.writeText(codeText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const exampleArrays = [
        { array: '1,3,5,7,9,11', target: '7' },
        { array: '10,20,30,40,50', target: '30' },
        { array: '2,4,6,8,10,12,14', target: '15' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-6">
                        <SearchIcon className="w-12 h-12 text-orange-400 mr-4 animate-bounce" />
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-indigo-400 bg-clip-text text-transparent">
                            Linear Search Algorithm
                        </h1>
                    </div>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Find elements in an array by checking each element sequentially until the target is found
                    </p>
                </div>
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-lg font-semibold mb-3 text-orange-300">
                                    Array Elements
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter array (comma-separated, e.g., 1,3,5,7,9)"
                                    value={array}
                                    onChange={handleArrayChange}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300"
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-semibold mb-3 text-indigo-300">
                                    Target Value
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter target number (e.g., 7)"
                                    value={target}
                                    onChange={handleTargetChange}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 flex items-center text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                {error}
                            </div>
                        )}
                        <div className="mb-6">
                            <p className="text-sm text-slate-400 mb-3">Quick examples:</p>
                            <div className="grid sm:grid-cols-3 gap-3">
                                {exampleArrays.map((example, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setArray(example.array);
                                            setTarget(example.target);
                                        }}
                                        className="p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm text-slate-300 hover:text-white transition-all duration-200 border border-slate-600/50 hover:border-slate-500"
                                    >
                                        <div className="font-mono text-xs mb-1">Array: [{example.array}]</div>
                                        <div className="font-mono text-xs">Target: {example.target}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="group relative w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-indigo-600 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                    Searching...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <Play className="w-5 h-5 mr-2" />
                                    Execute Search
                                </div>
                            )}
                        </button>
                    </div>
                </div>
                {result && (
                    <div className="max-w-4xl mx-auto mb-12">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 animate-fadeIn">
                            <div className="flex items-center mb-6">
                                {result.found ? (
                                    <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                                ) : (
                                    <Target className="w-6 h-6 text-red-400 mr-3" />
                                )}
                                <h2 className={`text-2xl font-bold ${result.found ? 'text-green-400' : 'text-red-400'}`}>
                                    Search Results
                                </h2>
                            </div>
                            
                            <div className="grid gap-6">
                                <div className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-orange-400">Search Outcome</h3>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            result.found 
                                                ? 'bg-green-900/50 text-green-300 border border-green-500/30'
                                                : 'bg-red-900/50 text-red-300 border border-red-500/30'
                                        }`}>
                                            {result.found ? 'FOUND' : 'NOT FOUND'}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                                            <span className="text-slate-300">Target Value:</span>
                                            <span className="font-mono text-lg text-indigo-400">{result.target}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                                            <span className="text-slate-300">Array:</span>
                                            <span className="font-mono text-sm text-slate-300">
                                                [{result.array.join(', ')}]
                                            </span>
                                        </div>
                                        
                                        {result.found ? (
                                            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border-l-4 border-green-400">
                                                <span className="text-slate-300">Found at Index:</span>
                                                <span className="font-mono text-lg text-green-400">{result.index}</span>
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-slate-900/50 rounded-lg border-l-4 border-red-400">
                                                <span className="text-red-300">Target not found in the array</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                                            <span className="text-slate-300">Elements Checked:</span>
                                            <span className="font-mono text-lg text-orange-400">
                                                {result.found ? result.index + 1 : result.array.length}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center mb-6">
                            <Info className="w-6 h-6 text-blue-400 mr-3" />
                            <h3 className="text-2xl font-bold text-blue-400">Understanding Linear Search</h3>
                        </div>
                        
                        <div className="prose prose-invert max-w-none">
                            <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                                Linear Search is the simplest searching algorithm that checks each element in the array sequentially 
                                until the target element is found or the entire array has been searched. It's also known as Sequential Search.
                            </p>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
                                    <h4 className="font-bold text-green-400 mb-3">Advantages</h4>
                                    <ul className="text-slate-300 space-y-2">
                                        <li>• Simple to implement and understand</li>
                                        <li>• Works on both sorted and unsorted arrays</li>
                                        <li>• No preprocessing required</li>
                                        <li>• Memory efficient (O(1) space complexity)</li>
                                    </ul>
                                </div>
                                
                                <div className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
                                    <h4 className="font-bold text-red-400 mb-3">Disadvantages</h4>
                                    <ul className="text-slate-300 space-y-2">
                                        <li>• Slow for large datasets (O(n) time complexity)</li>
                                        <li>• Inefficient compared to binary search for sorted arrays</li>
                                        <li>• Performance degrades linearly with input size</li>
                                        <li>• Not suitable for real-time applications with large data</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-6 p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
                                <h4 className="font-bold text-orange-400 mb-3">Time Complexity Analysis</h4>
                                <div className="grid sm:grid-cols-3 gap-4 text-center">
                                    <div className="p-3 bg-slate-900/50 rounded-lg">
                                        <div className="text-green-400 font-mono text-lg">O(1)</div>
                                        <div className="text-slate-400 text-sm">Best Case</div>
                                        <div className="text-slate-300 text-xs">Target is first element</div>
                                    </div>
                                    <div className="p-3 bg-slate-900/50 rounded-lg">
                                        <div className="text-orange-400 font-mono text-lg">O(n)</div>
                                        <div className="text-slate-400 text-sm">Average Case</div>
                                        <div className="text-slate-300 text-xs">Target is in middle</div>
                                    </div>
                                    <div className="p-3 bg-slate-900/50 rounded-lg">
                                        <div className="text-red-400 font-mono text-lg">O(n)</div>
                                        <div className="text-slate-400 text-sm">Worst Case</div>
                                        <div className="text-slate-300 text-xs">Target is last or not found</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <Code className="w-6 h-6 text-yellow-400 mr-3" />
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
                                    onClick={toggleCode}
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
                                        <code>{`def linear_search(arr, target):
    """
    Linear Search Algorithm
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    for index, value in enumerate(arr):
        if value == target:
            return index
    return -1

# Example usage
arr = [1, 3, 5, 7, 9, 11]
target = 7
result = linear_search(arr, target)
if result != -1:
    print(f"Target found at index: {result}")
else:
    print("Target not found in the array")`}</code>
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slideDown {
                    from { opacity: 0; max-height: 0; }
                    to { opacity: 1; max-height: 1000px; }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
                
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Search;