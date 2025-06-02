import React, { useState } from 'react';
import { GitBranch, Play, Code, Info, CheckCircle, AlertCircle, Copy, Eye, EyeOff } from 'lucide-react';

const BinaryTree = () => {
    const [values, setValues] = useState('');
    const [traversals, setTraversals] = useState(null);
    const [showCode, setShowCode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleInputChange = (e) => {
        setValues(e.target.value);
        if (error) setError('');
    };

    const handleSubmit = async () => {
        if (!values.trim()) {
            setError('Please enter some values');
            return;
        }

        setLoading(true);
        setError('');
        
        const inputValues = values.split(',').map((v) => v.trim()).filter(v => v);
        
        try {
            const response = await fetch('http://127.0.0.1:5000/create-tree', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ values: inputValues }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate traversals');
            }
            
            const data = await response.json();
            setTraversals(data);
        } catch (error) {
            console.error('Error fetching traversals:', error);
            setError('Failed to connect to server. Please make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const toggleCode = () => {
        setShowCode(!showCode);
    };

    const copyCode = () => {
        const codeText = `# Inorder Traversal
def inorder(root):
    if root:
        inorder(root.left)
        print(root.value, end=' ')
        inorder(root.right)

# Preorder Traversal
def preorder(root):
    if root:
        print(root.value, end=' ')
        preorder(root.left)
        preorder(root.right)

# Postorder Traversal
def postorder(root):
    if root:
        postorder(root.left)
        postorder(root.right)
        print(root.value, end=' ')`;
        
        navigator.clipboard.writeText(codeText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const exampleValues = ['4,2,6,1,3,5,7', '1,2,3,4,5', '10,5,15,3,7,12,18'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-6">
                        <GitBranch className="w-12 h-12 text-cyan-400 mr-4 animate-bounce" />
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            Binary Tree Traversals
                        </h1>
                    </div>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Explore the three fundamental ways to traverse a binary tree: Inorder, Preorder, and Postorder
                    </p>
                </div>

                
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                        <div className="mb-6">
                            <label className="block text-lg font-semibold mb-3 text-cyan-300">
                                Enter Tree Values
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter values (comma-separated, e.g., 4,2,6,1,3,5,7)"
                                    value={values}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                                />
                                {error && (
                                    <div className="absolute top-full left-0 mt-2 flex items-center text-red-400 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>

                        
                        <div className="mb-6">
                            <p className="text-sm text-slate-400 mb-2">Quick examples:</p>
                            <div className="flex flex-wrap gap-2">
                                {exampleValues.map((example, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setValues(example)}
                                        className="px-3 py-1 bg-slate-700/50 hover:bg-slate-600/50 rounded-md text-sm text-slate-300 hover:text-white transition-all duration-200"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </div>

                        
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="group relative w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                    Generating...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <Play className="w-5 h-5 mr-2" />
                                    Generate Traversals
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                
                {traversals && (
                    <div className="max-w-4xl mx-auto mb-12">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 animate-fadeIn">
                            <div className="flex items-center mb-6">
                                <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                                <h2 className="text-2xl font-bold text-green-400">Traversal Results</h2>
                            </div>
                            
                            <div className="grid gap-6">
                                {[
                                    { name: 'Inorder', data: traversals.inorder, color: 'cyan', description: 'Left → Root → Right' },
                                    { name: 'Preorder', data: traversals.preorder, color: 'purple', description: 'Root → Left → Right' },
                                    { name: 'Postorder', data: traversals.postorder, color: 'pink', description: 'Left → Right → Root' }
                                ].map((traversal, index) => (
                                    <div key={index} className="group p-6 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className={`text-xl font-semibold text-${traversal.color}-400`}>
                                                {traversal.name} Traversal
                                            </h3>
                                            <span className="text-sm text-slate-400">{traversal.description}</span>
                                        </div>
                                        <div className={`p-4 bg-slate-900/50 rounded-lg font-mono text-lg border-l-4 border-${traversal.color}-400`}>
                                            {traversal.data.join(' → ')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center mb-6">
                            <Info className="w-6 h-6 text-blue-400 mr-3" />
                            <h3 className="text-2xl font-bold text-blue-400">Understanding Binary Tree Traversals</h3>
                        </div>
                        
                        <div className="prose prose-invert max-w-none">
                            <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                                Binary Tree traversal refers to the process of visiting all the nodes in a binary tree in a specific order. 
                                Each traversal method serves different purposes and provides unique insights into the tree structure.
                            </p>
                            
                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    {
                                        title: 'Inorder Traversal',
                                        order: 'Left → Root → Right',
                                        use: 'Gets nodes in sorted order for BST',
                                        color: 'cyan'
                                    },
                                    {
                                        title: 'Preorder Traversal',
                                        order: 'Root → Left → Right',
                                        use: 'Creates a copy of the tree',
                                        color: 'purple'
                                    },
                                    {
                                        title: 'Postorder Traversal',
                                        order: 'Left → Right → Root',
                                        use: 'Deletes or frees nodes safely',
                                        color: 'pink'
                                    }
                                ].map((item, index) => (
                                    <div key={index} className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
                                        <h4 className={`font-bold text-${item.color}-400 mb-3`}>{item.title}</h4>
                                        <p className="text-slate-300 mb-2"><strong>Order:</strong> {item.order}</p>
                                        <p className="text-slate-400 text-sm"><strong>Common Use:</strong> {item.use}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Code Section */}
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
                                        <code>{`# Inorder Traversal (Left → Root → Right)
def inorder(root):
    if root:
        inorder(root.left)
        print(root.value, end=' ')
        inorder(root.right)

# Preorder Traversal (Root → Left → Right)
def preorder(root):
    if root:
        print(root.value, end=' ')
        preorder(root.left)
        preorder(root.right)

# Postorder Traversal (Left → Right → Root)
def postorder(root):
    if root:
        postorder(root.left)
        postorder(root.right)
        print(root.value, end=' ')`}</code>
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

export default BinaryTree;