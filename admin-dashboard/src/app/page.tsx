"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiLogOut, FiPlus, FiBox, FiSettings, FiUsers } from 'react-icons/fi';
import Image from 'next/image';

export default function AdminDashboard() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check admin on mount
  useEffect(() => {
    const checkAdmin = () => {
      const userInfoStr = localStorage.getItem('adminInfo');
      if (userInfoStr) {
        const user = JSON.parse(userInfoStr);
        if (user.role !== 'admin') {
          router.replace('/login');
        } else {
          setAdminName(user.name);
        }
      } else {
        router.replace('/login');
      }
    };
    checkAdmin();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    router.replace('/login');
  };

  const handleSizeToggle = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price.toString());
    formData.append('description', description);
    formData.append('stock', stock.toString());
    formData.append('sizes', sizes.join(','));
    if (image) {
      formData.append('image', image);
    }

    try {
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
        body: formData,
      });

      if (res.ok) {
        alert('Product created successfully and is now live on the store!');
        // Reset form
        setName('');
        setPrice('');
        setDescription('');
        setStock('');
        setSizes(['S', 'M', 'L', 'XL']);
        setImage(null);
        setImagePreview(null);
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Failed to create product', error);
      alert('An error occurred while communicating with the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <span className="text-xl font-black uppercase tracking-tighter">The 8 Admin</span>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'products' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <FiPlus className="mr-3 h-5 w-5" />
            Add New Product
          </button>
          <button
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-400 cursor-not-allowed`}
          >
            <FiBox className="mr-3 h-5 w-5" />
            Manage Inventory (Soon)
          </button>
          <button
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-400 cursor-not-allowed`}
          >
            <FiUsers className="mr-3 h-5 w-5" />
            Customers (Soon)
          </button>
          <button
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-400 cursor-not-allowed`}
          >
            <FiSettings className="mr-3 h-5 w-5" />
            Settings (Soon)
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <FiLogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="mr-4 md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-gray-800 truncate">Product Management</h2>
          </div>
          <div className="flex items-center shrink-0">
            <span className="text-sm text-gray-500 mr-2 hidden sm:inline">Logged in as</span>
            <span className="text-sm font-semibold text-gray-900 truncate max-w-[100px] sm:max-w-none">{adminName}</span>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-sm text-gray-500 mt-1">Information entered here will appear directly on the live storefront.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Noir Emblem Hoodie"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black outline-none transition text-black"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full pl-7 px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black outline-none transition text-black"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
                    <input
                      required
                      type="number"
                      min="0"
                      placeholder="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black outline-none transition text-black"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Detailed product description..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black outline-none transition resize-none text-black"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Available Sizes</label>
                  <div className="flex flex-wrap gap-3">
                    {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <label
                        key={size}
                        className={`flex items-center justify-center w-12 h-10 border rounded-md cursor-pointer select-none transition-colors ${sizes.includes(size) ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={sizes.includes(size)}
                          onChange={() => handleSizeToggle(size)}
                        />
                        <span className="text-sm font-semibold">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>

                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors">
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <div className="flex flex-col items-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imagePreview} alt="Preview" className="h-48 object-contain mb-4 rounded-md shadow-sm" />
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                              <span>Change Image</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <>
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600 justify-center">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                              <span>Upload a file</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" required accept="image/*" onChange={handleImageChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-8 border-t border-gray-200">
                  <button
                    type="submit"
                    className={`w-full md:w-auto px-6 py-2.5 bg-black text-white rounded-md font-medium hover:bg-gray-900 transition flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Publish Product to Store'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
