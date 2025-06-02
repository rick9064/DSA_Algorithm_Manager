import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Play, RotateCcw, Code2, Zap, Clock, BarChart3, Shuffle, CheckCircle, AlertCircle, TrendingUp, Copy, Eye, EyeOff } from 'lucide-react';

function Sort() {
  const [inputArray, setInputArray] = useState('64, 34, 25, 12, 22, 11, 90');
  const [array, setArray] = useState([]);
  const [sortedArray, setSortedArray] = useState([]);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [showCode, setShowCode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [sortingSteps, setSortingSteps] = useState([]);
  const [lastOperation, setLastOperation] = useState('');
  const [copied, setCopied] = useState(false);

  const algorithms = {
    bubble: {
      name: 'Bubble Sort',
      complexity: 'O(n²)',
      description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.'
    },
    selection: {
      name: 'Selection Sort',
      complexity: 'O(n²)',
      description: 'Finds the minimum element and places it at the beginning, then repeats for the remaining elements.'
    },
    insertion: {
      name: 'Insertion Sort',
      complexity: 'O(n²)',
      description: 'Builds the final sorted array one item at a time by inserting each element into its proper position.'
    },
    quick: {
      name: 'Quick Sort',
      complexity: 'O(n log n)',
      description: 'Divides the array into smaller sub-arrays around a pivot element and recursively sorts them.'
    }
  };

  const bubbleSort = (arr) => {
    const steps = [];
    const workingArray = [...arr];
    let comparisonCount = 0;
    let swapCount = 0;

    for (let i = 0; i < workingArray.length; i++) {
      for (let j = 0; j < workingArray.length - i - 1; j++) {
        comparisonCount++;
        steps.push({
          array: [...workingArray],
          comparing: [j, j + 1],
          swapping: false,
          comparisons: comparisonCount,
          swaps: swapCount
        });

        if (workingArray[j] > workingArray[j + 1]) {
          [workingArray[j], workingArray[j + 1]] = [workingArray[j + 1], workingArray[j]];
          swapCount++;
          steps.push({
            array: [...workingArray],
            comparing: [j, j + 1],
            swapping: true,
            comparisons: comparisonCount,
            swaps: swapCount
          });
        }
      }
    }

    steps.push({
      array: [...workingArray],
      comparing: [],
      swapping: false,
      comparisons: comparisonCount,
      swaps: swapCount,
      completed: true
    });

    return { sortedArray: workingArray, steps, comparisons: comparisonCount, swaps: swapCount };
  };

  const selectionSort = (arr) => {
    const steps = [];
    const workingArray = [...arr];
    let comparisonCount = 0;
    let swapCount = 0;

    for (let i = 0; i < workingArray.length - 1; i++) {
      let minIdx = i;
      
      for (let j = i + 1; j < workingArray.length; j++) {
        comparisonCount++;
        steps.push({
          array: [...workingArray],
          comparing: [minIdx, j],
          swapping: false,
          comparisons: comparisonCount,
          swaps: swapCount
        });

        if (workingArray[j] < workingArray[minIdx]) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        [workingArray[i], workingArray[minIdx]] = [workingArray[minIdx], workingArray[i]];
        swapCount++;
        steps.push({
          array: [...workingArray],
          comparing: [i, minIdx],
          swapping: true,
          comparisons: comparisonCount,
          swaps: swapCount
        });
      }
    }

    steps.push({
      array: [...workingArray],
      comparing: [],
      swapping: false,
      comparisons: comparisonCount,
      swaps: swapCount,
      completed: true
    });

    return { sortedArray: workingArray, steps, comparisons: comparisonCount, swaps: swapCount };
  };

  const insertionSort = (arr) => {
    const steps = [];
    const workingArray = [...arr];
    let comparisonCount = 0;
    let swapCount = 0;

    for (let i = 1; i < workingArray.length; i++) {
      let key = workingArray[i];
      let j = i - 1;

      while (j >= 0) {
        comparisonCount++;
        steps.push({
          array: [...workingArray],
          comparing: [j, j + 1],
          swapping: false,
          comparisons: comparisonCount,
          swaps: swapCount
        });

        if (workingArray[j] > key) {
          workingArray[j + 1] = workingArray[j];
          swapCount++;
          j--;
        } else {
          break;
        }
      }
      workingArray[j + 1] = key;
    }

    steps.push({
      array: [...workingArray],
      comparing: [],
      swapping: false,
      comparisons: comparisonCount,
      swaps: swapCount,
      completed: true
    });

    return { sortedArray: workingArray, steps, comparisons: comparisonCount, swaps: swapCount };
  };

  const quickSort = (arr) => {
    const steps = [];
    let comparisonCount = 0;
    let swapCount = 0;

    const quickSortHelper = (array, low, high) => {
      if (low < high) {
        const pi = partition(array, low, high);
        quickSortHelper(array, low, pi - 1);
        quickSortHelper(array, pi + 1, high);
      }
    };

    const partition = (array, low, high) => {
      const pivot = array[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        comparisonCount++;
        steps.push({
          array: [...array],
          comparing: [j, high],
          swapping: false,
          comparisons: comparisonCount,
          swaps: swapCount
        });

        if (array[j] < pivot) {
          i++;
          [array[i], array[j]] = [array[j], array[i]];
          swapCount++;
          steps.push({
            array: [...array],
            comparing: [i, j],
            swapping: true,
            comparisons: comparisonCount,
            swaps: swapCount
          });
        }
      }

      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      swapCount++;
      return i + 1;
    };

    const workingArray = [...arr];
    quickSortHelper(workingArray, 0, workingArray.length - 1);

    steps.push({
      array: [...workingArray],
      comparing: [],
      swapping: false,
      comparisons: comparisonCount,
      swaps: swapCount,
      completed: true
    });

    return { sortedArray: workingArray, steps, comparisons: comparisonCount, swaps: swapCount };
  };

  const parseArray = () => {
    try {
      const parsed = inputArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      if (parsed.length === 0) {
        setLastOperation('Please enter valid numbers');
        return false;
      }
      setArray(parsed);
      return true;
    } catch (error) {
      setLastOperation('Invalid array format');
      return false;
    }
  };

  const handleSort = async () => {
    if (!parseArray()) return;

    setIsAnimating(true);
    setCurrentStep(0);
    setComparisons(0);
    setSwaps(0);
    setSortedArray([]);

    const sortFunctions = {
      bubble: bubbleSort,
      selection: selectionSort,
      insertion: insertionSort,
      quick: quickSort
    };

    const result = sortFunctions[algorithm](array);
    setSortingSteps(result.steps);
    for (let i = 0; i < result.steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentStep(i);
      setComparisons(result.steps[i].comparisons);
      setSwaps(result.steps[i].swaps);
    }

    setSortedArray(result.sortedArray);
    setLastOperation(`Sorted using ${algorithms[algorithm].name}`);
    setIsAnimating(false);
  };

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 8) + 5; 
    const randomArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    setInputArray(randomArray.join(', '));
  };

  const resetSort = () => {
    setArray([]);
    setSortedArray([]);
    setSortingSteps([]);
    setCurrentStep(0);
    setComparisons(0);
    setSwaps(0);
    setLastOperation('');
  };

  const getCurrentArray = () => {
    if (sortingSteps.length > 0 && currentStep < sortingSteps.length) {
      return sortingSteps[currentStep].array;
    }
    return sortedArray.length > 0 ? sortedArray : array;
  };

  const getBarColor = (index) => {
    if (sortingSteps.length === 0 || currentStep >= sortingSteps.length) {
      return 'from-cyan-500 to-purple-600';
    }

    const step = sortingSteps[currentStep];
    if (step.comparing && step.comparing.includes(index)) {
      return step.swapping ? 'from-red-500 to-pink-600' : 'from-yellow-500 to-orange-600';
    }
    return 'from-cyan-500 to-purple-600';
  };

  const copyCode = () => {
    const codeText = `def bubble_sort(arr):
    """Bubble Sort - O(n²) time complexity"""
    n = len(arr)
    for i in range(n):
        # Flag to optimize - if no swaps occur, array is sorted
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        # If no swapping occurred, array is sorted
        if not swapped:
            break
    return arr`;
        
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
            <ArrowUpDown className="w-10 h-10 text-cyan-400 mr-3 animate-bounce" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Sorting Algorithms
            </h1>
            <TrendingUp className="w-10 h-10 text-cyan-400 ml-3 animate-bounce" />
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Visualize and compare different sorting algorithms with interactive animations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Zap className="w-6 h-6 text-yellow-400 mr-2" />
              Sort Configuration
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">Select Algorithm:</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(algorithms).map(([key, algo]) => (
                  <button
                    key={key}
                    onClick={() => setAlgorithm(key)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      algorithm === key 
                        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300' 
                        : 'border-white/20 hover:border-cyan-400/50 hover:bg-cyan-400/5'
                    }`}
                  >
                    <div className="font-semibold">{algo.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{algo.complexity}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">Array to Sort:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputArray}
                  onChange={(e) => setInputArray(e.target.value)}
                  placeholder="Enter numbers separated by commas"
                  className="flex-1 p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                />
                <button
                  onClick={generateRandomArray}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center"
                >
                  <Shuffle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={handleSort}
                disabled={isAnimating || !inputArray.trim()}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
              >
                {isAnimating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Sorting...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Sort
                  </>
                )}
              </button>
              <button
                onClick={resetSort}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </button>
            </div>

            {lastOperation && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-4 flex items-center mb-6">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-green-300 font-medium">{lastOperation}</span>
              </div>
            )}

            <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-400/30 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="font-semibold text-yellow-300">{algorithms[algorithm].name}</span>
              </div>
              <div className="text-sm text-slate-300 mb-2">
                Time Complexity: <span className="text-cyan-400 font-mono">{algorithms[algorithm].complexity}</span>
              </div>
              <p className="text-sm text-slate-300">{algorithms[algorithm].description}</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 text-purple-400 mr-2" />
              Array Visualization
            </h3>

            <div className="mb-8">
              <div className="h-64 flex items-end justify-center gap-2 p-4 bg-slate-800/50 rounded-xl">
                {getCurrentArray().length === 0 ? (
                  <div className="flex items-center justify-center w-full text-slate-400">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Enter an array to visualize
                  </div>
                ) : (
                  getCurrentArray().map((value, index) => {
                    const maxValue = Math.max(...getCurrentArray());
                    const height = (value / maxValue) * 200;
                    return (
                      <div key={`${value}-${index}`} className="flex flex-col items-center">
                        <div
                          className={`bg-gradient-to-t ${getBarColor(index)} rounded-t-lg transition-all duration-300 flex items-end justify-center text-white text-xs font-bold pb-1`}
                          style={{ 
                            height: `${height}px`, 
                            width: '40px',
                            minHeight: '20px'
                          }}
                        >
                          {value}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">{comparisons}</div>
                <div className="text-sm text-slate-400">Comparisons</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{swaps}</div>
                <div className="text-sm text-slate-400">Swaps</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-pink-400">{getCurrentArray().length}</div>
                <div className="text-sm text-slate-400">Array Size</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded mr-2"></div>
                <span className="text-slate-300">Comparing</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-600 rounded mr-2"></div>
                <span className="text-slate-300">Swapping</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded mr-2"></div>
                <span className="text-slate-300">Normal</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
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
                    <code>{`def bubble_sort(arr):
    """Bubble Sort - O(n²) time complexity"""
    n = len(arr)
    for i in range(n):
        # Flag to optimize - if no swaps occur, array is sorted
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        # If no swapping occurred, array is sorted
        if not swapped:
            break
    return arr`}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute top-20 left-10 opacity-20 font-mono text-sm text-cyan-400 animate-pulse">
        {"arr.sort()"}
      </div>
      <div className="absolute top-40 right-20 opacity-20 font-mono text-sm text-purple-400 animate-pulse delay-500">
        {"O(n²)"}
      </div>
      <div className="absolute bottom-40 left-20 opacity-20 font-mono text-sm text-pink-400 animate-pulse delay-1000">
        {"swap(i, j)"}
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 font-mono text-sm text-cyan-400 animate-pulse delay-1500">
        {"compare()"}
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

export default Sort;