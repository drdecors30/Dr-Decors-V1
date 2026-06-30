import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass, LayoutGrid, Package, Folder, Mail, FileText, CheckCircle2,
  Users, Settings, LogOut, Plus, Edit2, Trash2, KeyRound, Check, X, Upload, Save
} from 'lucide-react';
import { IProduct, ICategory, IContactMessage, IPurchaseRequest, INewsletterSubscriber, ICompanyDetails, IFAQ } from '../types';

interface AdminDashboardProps {
  products: IProduct[];
  categories: ICategory[];
  onRefreshData: () => Promise<void>;
  onLogout: () => void;
  token: string | null;
}

type TabId = 'overview' | 'products' | 'categories' | 'enquiries' | 'purchases' | 'subscribers' | 'settings';

export default function AdminDashboardView({
  products,
  categories,
  onRefreshData,
  onLogout,
  token,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [stats, setStats] = useState<any>(null);
  const [enquiries, setEnquiries] = useState<IContactMessage[]>([]);
  const [purchases, setPurchases] = useState<IPurchaseRequest[]>([]);
  const [subscribers, setSubscribers] = useState<INewsletterSubscriber[]>([]);
  
  // Settings edit states
  const [contactName, setContactName] = useState('Dr. Decors');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [contactHours, setContactHours] = useState('');
  const [contactMap, setContactMap] = useState('');
  const [faqsList, setFaqsList] = useState<IFAQ[]>([]);
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdError, setPwdError] = useState(false);

  // Custom Delete and Toast states
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'product' | 'category' | 'enquiry' | 'purchase' | 'subscriber';
    id: string;
    label: string;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => prev?.text === text ? null : prev);
    }, 4000);
  };

  const checkAuthFailure = (res: Response): boolean => {
    if (res.status === 401) {
      showToast('Session expired or invalid. Please login again.', 'error');
      setTimeout(() => {
        onLogout();
      }, 1500);
      return true;
    }
    return false;
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    setDeleteTarget(null); // Close modal

    try {
      let url = '';
      let method = 'DELETE';
      let headers: any = { Authorization: `Bearer ${token}` };

      if (type === 'product') {
        url = `/api/products/${id}`;
      } else if (type === 'category') {
        url = `/api/categories/${id}`;
      } else if (type === 'enquiry') {
        url = `/api/admin/enquiries/${id}`;
      } else if (type === 'purchase') {
        url = `/api/admin/purchase-requests/${id}`;
      } else if (type === 'subscriber') {
        url = `/api/admin/subscribers/${id}`;
      }

      const res = await fetch(url, { method, headers });
      if (checkAuthFailure(res)) return;
      const data = await res.json();

      if (data.success) {
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`, 'success');
        await onRefreshData();
        await fetchDashboardData();
      } else {
        showToast(data.error || `Failed to delete ${type}.`, 'error');
      }
    } catch (err: any) {
      showToast('Network error while deleting item.', 'error');
      console.error(err);
    }
  };

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

  // Product Form States
  const [prodTitle, setProdTitle] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOrigPrice, setProdOrigPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodStock, setProdStock] = useState<'In Stock' | 'Out of Stock'>('In Stock');
  const [prodRating, setProdRating] = useState('4.5');
  const [prodSpecs, setProdSpecs] = useState<{ key: string; value: string }[]>([]);
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodFile, setProdFile] = useState<File | null>(null);

  // Category Form States
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImageUrl, setCatImageUrl] = useState('');
  const [catFile, setCatFile] = useState<File | null>(null);

  // Error/Success state inside modals
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  // Fetch admin dashboard elements
  const fetchDashboardData = async () => {
    if (!token) return;
    try {
      // 1. Stats
      const statsRes = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (checkAuthFailure(statsRes)) return;
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.stats);

      // 2. Enquiries
      const enqRes = await fetch('/api/admin/enquiries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (checkAuthFailure(enqRes)) return;
      const enqData = await enqRes.json();
      if (enqData.success) setEnquiries(enqData.enquiries);

      // 3. Purchases
      const purRes = await fetch('/api/admin/purchase-requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (checkAuthFailure(purRes)) return;
      const purData = await purRes.json();
      if (purData.success) setPurchases(purData.purchaseRequests);

      // 4. Subscribers
      const subRes = await fetch('/api/admin/subscribers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (checkAuthFailure(subRes)) return;
      const subData = await subRes.json();
      if (subData.success) setSubscribers(subData.subscribers);

      // 5. Global Settings
      const setRes = await fetch('/api/settings');
      const setData = await setRes.json();
      if (setData.success && setData.settings) {
        const det = setData.settings.contact_details;
        if (det) {
          setContactEmail(det.email || '');
          setContactPhone(det.phone || '');
          setContactAddress(det.address || '');
          setContactHours(det.businessHours || '');
          setContactMap(det.mapLink || '');
        }
        setFaqsList(setData.settings.faqs || []);
      }
    } catch (err) {
      console.error('Error loading dashboard datasets:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token, activeTab]);

  // Product CRUD
  const handleOpenProductModal = (product: IProduct | null = null) => {
    setModalError('');
    setModalSuccess('');
    setProdFile(null);
    if (product) {
      setEditingProduct(product);
      setProdTitle(product.title);
      setProdDesc(product.description);
      setProdPrice(product.price.toString());
      setProdOrigPrice(product.originalPrice?.toString() || '');
      setProdCategory(product.category);
      setProdImageUrl(product.imageUrl);
      setProdStock(product.stockStatus);
      setProdRating(product.rating.toString());
      setProdSpecs(product.specs || []);
      setProdFeatured(product.featured);
    } else {
      setEditingProduct(null);
      setProdTitle('');
      setProdDesc('');
      setProdPrice('');
      setProdOrigPrice('');
      setProdCategory(categories[0]?.slug || '');
      setProdImageUrl('');
      setProdStock('In Stock');
      setProdRating('4.5');
      setProdSpecs([
        { key: 'Material', value: 'Wood, Brass' },
        { key: 'Dimensions', value: '30" H x 20" W' }
      ]);
      setProdFeatured(false);
    }
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle || !prodDesc || !prodPrice || !prodCategory) {
      setModalError('Please specify title, description, price, and category.');
      return;
    }

    const formData = new FormData();
    formData.append('title', prodTitle);
    formData.append('description', prodDesc);
    formData.append('price', prodPrice);
    if (prodOrigPrice) formData.append('originalPrice', prodOrigPrice);
    formData.append('category', prodCategory);
    formData.append('stockStatus', prodStock);
    formData.append('rating', prodRating);
    formData.append('specs', JSON.stringify(prodSpecs));
    formData.append('featured', prodFeatured.toString());
    
    if (prodFile) {
      formData.append('image', prodFile);
    } else {
      formData.append('imageUrl', prodImageUrl);
    }

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id || editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (checkAuthFailure(res)) return;
      const data = await res.json();

      if (data.success) {
        setModalSuccess(editingProduct ? 'Product edited successfully!' : 'New product created!');
        await onRefreshData();
        await fetchDashboardData();
        setTimeout(() => setIsProductModalOpen(false), 1200);
      } else {
        setModalError(data.error || 'Failed to complete product transaction.');
      }
    } catch {
      setModalError('Network error connecting to backend.');
    }
  };

  const handleDeleteProduct = (id: string) => {
    const p = products.find(prod => (prod.id || prod._id) === id);
    setDeleteTarget({
      type: 'product',
      id,
      label: p ? p.title : 'this product'
    });
  };

  // Category CRUD
  const handleOpenCategoryModal = (cat: ICategory | null = null) => {
    setModalError('');
    setModalSuccess('');
    setCatFile(null);
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatSlug(cat.slug);
      setCatDesc(cat.description || '');
      setCatImageUrl(cat.imageUrl || '');
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatSlug('');
      setCatDesc('');
      setCatImageUrl('');
    }
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName || !catSlug) {
      setModalError('Please specify category name and slug.');
      return;
    }

    const formData = new FormData();
    formData.append('name', catName);
    formData.append('slug', catSlug);
    formData.append('description', catDesc);
    
    if (catFile) {
      formData.append('image', catFile);
    } else {
      formData.append('imageUrl', catImageUrl);
    }

    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id || editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (checkAuthFailure(res)) return;
      const data = await res.json();

      if (data.success) {
        setModalSuccess(editingCategory ? 'Category edited successfully!' : 'New category created!');
        await onRefreshData();
        await fetchDashboardData();
        setTimeout(() => setIsCategoryModalOpen(false), 1200);
      } else {
        setModalError(data.error || 'Failed to complete category transaction.');
      }
    } catch {
      setModalError('Network error connecting to backend.');
    }
  };

  const handleDeleteCategory = (id: string) => {
    const c = categories.find(cat => (cat.id || cat._id) === id);
    setDeleteTarget({
      type: 'category',
      id,
      label: c ? `${c.name} Collection` : 'this category'
    });
  };

  // Enquiry updates
  const handleToggleEnquiryStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'unread' ? 'read' : 'replied';
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (checkAuthFailure(res)) return;
      const data = await res.json();
      if (data.success) fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEnquiry = (id: string) => {
    const m = enquiries.find(enq => (enq.id || enq._id) === id);
    setDeleteTarget({
      type: 'enquiry',
      id,
      label: m ? `Enquiry from ${m.name}` : 'this enquiry message'
    });
  };

  // Purchase updates
  const handleUpdatePurchaseStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/purchase-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
      });
      if (checkAuthFailure(res)) return;
      const data = await res.json();
      if (data.success) fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePurchaseRequest = (id: string) => {
    const r = purchases.find(req => (req.id || req._id) === id);
    setDeleteTarget({
      type: 'purchase',
      id,
      label: r ? `Purchase request for ${r.productTitle || 'product'}` : 'this purchase request'
    });
  };

  // Unsubscribe Newsletter
  const handleDeleteSubscriber = (id: string) => {
    const s = subscribers.find(sub => (sub.id || sub._id) === id);
    setDeleteTarget({
      type: 'subscriber',
      id,
      label: s ? `Subscriber (${s.email})` : 'this subscriber'
    });
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Save contact details
      const details = {
        companyName: contactName,
        email: contactEmail,
        phone: contactPhone,
        address: contactAddress,
        businessHours: contactHours,
        mapLink: contactMap
      };
      
      const res1 = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ key: 'contact_details', value: details }),
      });
      if (checkAuthFailure(res1)) return;
      
      // 2. Save FAQs
      const res2 = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ key: 'faqs', value: faqsList }),
      });
      if (checkAuthFailure(res2)) return;

      const d1 = await res1.json();
      const d2 = await res2.json();

      if (d1.success && d2.success) {
        showToast('Showroom settings and FAQs saved successfully in MongoDB!', 'success');
        await fetchDashboardData();
      } else {
        showToast('Failed to save settings.', 'error');
      }
    } catch {
      showToast('Network error while saving settings.', 'error');
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPwdMsg('Specify both current and new password.');
      setPwdError(true);
      return;
    }

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (checkAuthFailure(res)) return;
      const data = await res.json();

      if (data.success) {
        setPwdMsg('Password updated successfully!');
        setPwdError(false);
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setPwdMsg(data.error || 'Failed to update password.');
        setPwdError(true);
      }
    } catch {
      setPwdMsg('Network error.');
      setPwdError(true);
    }
  };

  // Helper dynamic specs list editor
  const addSpecItem = () => {
    setProdSpecs([...prodSpecs, { key: '', value: '' }]);
  };

  const removeSpecItem = (idx: number) => {
    setProdSpecs(prodSpecs.filter((_, i) => i !== idx));
  };

  const updateSpecItem = (idx: number, field: 'key' | 'value', val: string) => {
    const updated = [...prodSpecs];
    updated[idx][field] = val;
    setProdSpecs(updated);
  };

  const addFaqItem = () => {
    setFaqsList([...faqsList, { q: 'New Question?', a: 'Answer here.' }]);
  };

  const removeFaqItem = (idx: number) => {
    setFaqsList(faqsList.filter((_, i) => i !== idx));
  };

  const updateFaqItem = (idx: number, field: 'q' | 'a', val: string) => {
    const updated = [...faqsList];
    updated[idx][field] = val;
    setFaqsList(updated);
  };

  return (
    <div id="admin-dashboard-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* SIDEBAR TABS BAR (Column 1) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#fcfcf9] border border-natural-border text-natural-text-dark rounded-[24px] p-5 shadow-none space-y-6">
            <div className="border-b border-natural-border pb-4">
              <h3 className="font-serif text-lg font-bold text-natural-text-dark">Aesthetic Admin</h3>
              <p className="text-[10px] text-natural-accent font-semibold tracking-wider font-mono">MONGODB ACTIVE</p>
            </div>
 
            <nav className="space-y-1.5 flex flex-col">
              {[
                { label: 'Overview', id: 'overview', icon: LayoutGrid },
                { label: 'Products', id: 'products', icon: Package },
                { label: 'Categories', id: 'categories', icon: Folder },
                { label: 'Enquiries', id: 'enquiries', icon: Mail },
                { label: 'Purchase Desk', id: 'purchases', icon: FileText },
                { label: 'Subscribers', id: 'subscribers', icon: Users },
                { label: 'Settings', id: 'settings', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as TabId)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                      activeTab === item.id
                        ? 'bg-natural-accent text-white font-bold shadow-md'
                        : 'text-natural-text-muted hover:bg-natural-input/30 hover:text-natural-text-dark'
                    }`}
                  >
                    <Icon size={14} /> {item.label}
                  </button>
                );
              })}
            </nav>
 
            <div className="border-t border-natural-border pt-4">
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3.5 py-2.5 text-xs text-rose-600 hover:bg-rose-50 rounded-full w-full text-left font-bold"
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          </div>
        </div>
 
        {/* DETAILS CONTENTS VIEW (Columns 2-5) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* TAB CONTENT: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h1 className="font-serif text-2xl font-extrabold text-natural-text-dark tracking-tight">System Performance</h1>
                <p className="text-xs text-natural-text-muted font-normal">Real-time telemetry reports synced directly with MongoDB cluster.</p>
              </div>
 
              {stats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { title: 'Total Products', val: stats.products },
                    { title: 'Enquiries (Inbox)', val: stats.enquiries },
                    { title: 'Pending Purchases', val: stats.pendingPurchaseRequests },
                    { title: 'Subscribers', val: stats.subscribers },
                  ].map((stat, sIdx) => (
                    <div key={sIdx} className="bg-white border border-natural-border rounded-2xl p-5 shadow-none space-y-1">
                      <span className="text-[10px] font-semibold text-natural-text-muted uppercase tracking-wider block">{stat.title}</span>
                      <p className="text-2xl font-extrabold text-natural-text-dark">{stat.val}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-natural-text-muted">Loading metrics...</p>
              )}
 
              {/* Direct Quick Actions */}
              <div className="bg-[#fcfcf9] border border-natural-border rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="space-y-1 text-center md:text-left">
                  <h4 className="font-bold text-sm text-natural-text-dark font-serif">Quick-Launch Diagnostics</h4>
                  <p className="text-xs text-natural-text-muted font-normal">Instantly add product items or category fields to your catalog database.</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleOpenProductModal(null)}
                    className="flex items-center gap-1.5 bg-natural-accent hover:bg-natural-accent-hover text-white font-bold text-xs px-5 py-3 rounded-full transition-all shadow-md"
                  >
                    <Plus size={14} /> Add Product
                  </button>
                  <button
                    onClick={() => handleOpenCategoryModal(null)}
                    className="flex items-center gap-1.5 bg-white border border-natural-border hover:border-natural-accent hover:text-natural-accent text-natural-text-dark font-bold text-xs px-5 py-3 rounded-full transition-all"
                  >
                    <Plus size={14} /> Add Category
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: PRODUCTS LIST */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-serif text-2xl font-extrabold text-stone-900 tracking-tight">Catalog Management</h1>
                  <p className="text-xs text-stone-500 font-light">Add, edit, or delete items within MongoDB collections.</p>
                </div>
                <button
                  onClick={() => handleOpenProductModal(null)}
                  className="flex items-center gap-1.5 bg-stone-950 hover:bg-amber-500 hover:text-stone-950 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
                >
                  <Plus size={14} /> Add Product
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white border border-stone-150 rounded-xl overflow-hidden shadow-xs text-xs">
                <table className="w-full text-left divide-y divide-stone-100">
                  <thead className="bg-stone-50 font-bold text-stone-700">
                    <tr>
                      <th className="px-6 py-4">Item</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {products.map((p, pIdx) => (
                      <tr key={p.id || p._id || pIdx} className="hover:bg-stone-50/40">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={p.imageUrl} alt={p.title} className="w-10 h-10 object-cover rounded border" />
                          <div>
                            <p className="font-bold text-stone-800">{p.title}</p>
                            {p.featured && <span className="text-[9px] font-bold text-amber-600 uppercase bg-amber-500/10 px-1 rounded">Featured</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-stone-500 uppercase">{p.category}</td>
                        <td className="px-6 py-4 font-bold text-stone-800">${p.price}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.stockStatus === 'In Stock' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                          }`}>
                            {p.stockStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenProductModal(p)}
                              className="p-1.5 bg-stone-50 text-stone-600 hover:bg-amber-50 hover:text-amber-600 rounded border transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id || p._id || '')}
                              className="p-1.5 bg-stone-50 text-stone-600 hover:bg-rose-50 hover:text-rose-600 rounded border transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB CONTENT: CATEGORIES LIST */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-serif text-2xl font-extrabold text-stone-900 tracking-tight">Specialty Areas</h1>
                  <p className="text-xs text-stone-500 font-light">Structure showroom groupings and slug hierarchies in MongoDB.</p>
                </div>
                <button
                  onClick={() => handleOpenCategoryModal(null)}
                  className="flex items-center gap-1.5 bg-stone-950 hover:bg-amber-500 hover:text-stone-950 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
                >
                  <Plus size={14} /> Add Category
                </button>
              </div>

              {/* Categories Table */}
              <div className="bg-white border border-stone-150 rounded-xl overflow-hidden shadow-xs text-xs">
                <table className="w-full text-left divide-y divide-stone-100">
                  <thead className="bg-stone-50 font-bold text-stone-700">
                    <tr>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Slug Identifier</th>
                      <th className="px-6 py-4">Description Summary</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {categories.map((c, cIdx) => (
                      <tr key={c.id || c._id || cIdx} className="hover:bg-stone-50/40">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={c.imageUrl} alt={c.name} className="w-10 h-10 object-cover rounded border" />
                          <span className="font-bold text-stone-850">{c.name}</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-stone-500 font-semibold">{c.slug}</td>
                        <td className="px-6 py-4 text-stone-500 line-clamp-1 max-w-xs">{c.description || 'N/A'}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenCategoryModal(c)}
                              className="p-1.5 bg-stone-50 text-stone-600 hover:bg-amber-50 hover:text-amber-600 rounded border transition-colors"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(c.id || c._id || '')}
                              className="p-1.5 bg-stone-50 text-stone-600 hover:bg-rose-50 hover:text-rose-600 rounded border transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB CONTENT: CUSTOMER ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl font-extrabold text-stone-900 tracking-tight">Customer Enquiries</h1>
                <p className="text-xs text-stone-500 font-light">Inspect client inquiries, messages, and feedback logged in MongoDB.</p>
              </div>

              {/* Enquiries list */}
              <div className="bg-white border border-stone-150 rounded-xl overflow-hidden shadow-xs text-xs">
                <table className="w-full text-left divide-y divide-stone-100">
                  <thead className="bg-stone-50 font-bold text-stone-700">
                    <tr>
                      <th className="px-6 py-4">Client Detail</th>
                      <th className="px-6 py-4">Message</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {enquiries.map((m, mIdx) => (
                      <tr key={m.id || m._id || mIdx} className={`hover:bg-stone-50/40 ${m.status === 'unread' ? 'bg-amber-500/[0.01]' : ''}`}>
                        <td className="px-6 py-4 w-1/4">
                          <p className="font-bold text-stone-850">{m.name}</p>
                          <p className="text-stone-400 text-[10px]">{m.email}</p>
                          {m.createdAt && <p className="text-[9px] text-stone-400 font-mono mt-0.5">{new Date(m.createdAt).toLocaleDateString()}</p>}
                        </td>
                        <td className="px-6 py-4">
                          {m.subject && <p className="font-bold text-stone-700 mb-0.5">Subj: {m.subject}</p>}
                          <p className="text-stone-500 leading-relaxed font-light">{m.message}</p>
                        </td>
                        <td className="px-6 py-4 w-32">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            m.status === 'unread' ? 'bg-amber-500/10 text-amber-600' : m.status === 'read' ? 'bg-stone-100 text-stone-500' : 'bg-emerald-500/10 text-emerald-600'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right w-24">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleToggleEnquiryStatus(m.id || m._id || '', m.status)}
                              className="p-1.5 bg-stone-50 text-stone-600 hover:bg-emerald-50 hover:text-emerald-600 rounded border transition-colors"
                              title={m.status === 'unread' ? 'Mark Read' : 'Mark Replied'}
                            >
                              <Check size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteEnquiry(m.id || m._id || '')}
                              className="p-1.5 bg-stone-50 text-stone-600 hover:bg-rose-50 hover:text-rose-600 rounded border transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB CONTENT: PURCHASE ORDERS */}
          {activeTab === 'purchases' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl font-extrabold text-stone-900 tracking-tight">Purchase Desk</h1>
                <p className="text-xs text-stone-500 font-light">Process product orders and buyer requests submitted through item pages.</p>
              </div>

              {/* Purchases list */}
              <div className="bg-white border border-stone-150 rounded-xl overflow-hidden shadow-xs text-xs">
                <table className="w-full text-left divide-y divide-stone-100">
                  <thead className="bg-stone-50 font-bold text-stone-700">
                    <tr>
                      <th className="px-6 py-4">Client Detail</th>
                      <th className="px-6 py-4">Item Requested</th>
                      <th className="px-6 py-4">Status & Notes</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {purchases.map((r, rIdx) => (
                      <tr key={r.id || r._id || rIdx} className="hover:bg-stone-50/40">
                        <td className="px-6 py-4 w-1/3 space-y-0.5">
                          <p className="font-bold text-stone-850">{r.customerName}</p>
                          <p className="text-stone-400 text-[10px]">{r.customerEmail} | {r.customerPhone}</p>
                          <p className="text-stone-500 font-light text-[10px]"><span className="font-bold">Ship:</span> {r.customerAddress}</p>
                          {r.createdAt && <p className="text-[9px] text-stone-400 font-mono pt-1">{new Date(r.createdAt).toLocaleDateString()}</p>}
                        </td>
                        <td className="px-6 py-4 font-bold text-stone-850">
                          {r.productTitle} <br />
                          <span className="text-[10px] font-light text-stone-400">ID: {r.productId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-stone-500 font-light line-clamp-2 mb-2 italic">"{r.message}"</p>
                          <select
                            value={r.status}
                            onChange={(e) => handleUpdatePurchaseStatus(r.id || r._id || '', e.target.value)}
                            className="border border-stone-200 rounded px-2.5 py-1 text-[10px] focus:outline-none focus:border-amber-500 bg-stone-50"
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right w-16">
                          <button
                            onClick={() => handleDeletePurchaseRequest(r.id || r._id || '')}
                            className="p-1.5 bg-stone-50 text-stone-600 hover:bg-rose-50 hover:text-rose-600 rounded border transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB CONTENT: NEWSLETTER SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl font-extrabold text-stone-900 tracking-tight">Newsletter subscribers</h1>
                <p className="text-xs text-stone-500 font-light">List of email accounts registered through newsletter signup containers.</p>
              </div>

              {/* Subscribers list */}
              <div className="bg-white border border-stone-150 rounded-xl overflow-hidden shadow-xs text-xs max-w-lg">
                <table className="w-full text-left divide-y divide-stone-100">
                  <thead className="bg-stone-50 font-bold text-stone-700">
                    <tr>
                      <th className="px-6 py-4">Email Address</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {subscribers.map((s, sIdx) => (
                      <tr key={s.id || s._id || sIdx} className="hover:bg-stone-50/40">
                        <td className="px-6 py-4 font-bold text-stone-850">{s.email}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteSubscriber(s.id || s._id || '')}
                            className="p-1.5 bg-stone-50 text-stone-600 hover:bg-rose-50 hover:text-rose-600 rounded border transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB CONTENT: SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-12">
              
              {/* Showroom settings */}
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <h1 className="font-serif text-2xl font-extrabold text-stone-900 tracking-tight">Showroom Configuration</h1>
                  <p className="text-xs text-stone-500 font-light">Update brand coordinates, address lines, physical map targets, and live FAQs.</p>
                </div>

                <div className="bg-white border border-stone-100 rounded-xl p-6 shadow-xs space-y-4 text-xs">
                  <h3 className="font-serif text-md font-bold text-stone-850">Coordinates</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-stone-700">Company Name</label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full border border-stone-200 px-3 py-2 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-stone-700">Email Address</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full border border-stone-200 px-3 py-2 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-stone-700">Showroom Phone</label>
                      <input
                        type="text"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full border border-stone-200 px-3 py-2 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-stone-700">Showroom Hours</label>
                      <input
                        type="text"
                        value={contactHours}
                        onChange={(e) => setContactHours(e.target.value)}
                        className="w-full border border-stone-200 px-3 py-2 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Physical Address</label>
                    <input
                      type="text"
                      value={contactAddress}
                      onChange={(e) => setContactAddress(e.target.value)}
                      className="w-full border border-stone-200 px-3 py-2 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Google Map embed link (iframe src URL attribute value)</label>
                    <input
                      type="text"
                      value={contactMap}
                      onChange={(e) => setContactMap(e.target.value)}
                      className="w-full border border-stone-200 px-3 py-2 rounded-lg font-mono text-[10px]"
                    />
                  </div>
                </div>

                {/* FAQ manager */}
                <div className="bg-white border border-stone-100 rounded-xl p-6 shadow-xs space-y-4 text-xs">
                  <div className="flex justify-between items-center border-b border-stone-50 pb-2">
                    <h3 className="font-serif text-md font-bold text-stone-850">Showroom FAQ Accordion</h3>
                    <button
                      type="button"
                      onClick={addFaqItem}
                      className="flex items-center gap-1 bg-stone-900 hover:bg-amber-600 hover:text-stone-950 text-white font-bold px-2.5 py-1.5 rounded"
                    >
                      <Plus size={11} /> Add FAQ
                    </button>
                  </div>

                  <div className="space-y-4 divide-y divide-stone-100">
                    {faqsList.map((faq, fIdx) => (
                      <div key={fIdx} className="space-y-3 pt-3 first:pt-0">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-stone-400">FAQ Item {fIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeFaqItem(fIdx)}
                            className="text-rose-500 hover:text-rose-600 font-bold"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-2.5">
                          <input
                            type="text"
                            placeholder="Question"
                            value={faq.q}
                            onChange={(e) => updateFaqItem(fIdx, 'q', e.target.value)}
                            className="w-full border border-stone-250 px-3 py-2 rounded-lg font-semibold bg-stone-50"
                          />
                          <textarea
                            rows={2}
                            placeholder="Answer text"
                            value={faq.a}
                            onChange={(e) => updateFaqItem(fIdx, 'a', e.target.value)}
                            className="w-full border border-stone-250 px-3 py-2 rounded-lg bg-stone-50"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-stone-950 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 ml-auto"
                  >
                    <Save size={14} /> Save Showroom Config
                  </button>
                </div>
              </form>

              {/* Password update settings */}
              <form onSubmit={handleChangePassword} className="space-y-6 pt-6 border-t border-stone-200">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">Change Admin Password</h3>
                  <p className="text-xs text-stone-500 font-light">Secure your portal credentials.</p>
                </div>

                <div className="bg-white border border-stone-100 rounded-xl p-6 shadow-xs space-y-4 text-xs max-w-md">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full border border-stone-200 px-3 py-2 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-stone-200 px-3 py-2 rounded-lg"
                    />
                  </div>

                  {pwdMsg && (
                    <p className={`text-xs font-semibold ${pwdError ? 'text-rose-500' : 'text-emerald-600'}`}>
                      {pwdMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white font-bold text-xs uppercase px-4 py-2 rounded-lg transition-colors"
                  >
                    Update Credentials
                  </button>
                </div>
              </form>

            </div>
          )}

        </div>
      </div>

      {/* MODAL WINDOWS FOR PRODUCTS AND CATEGORIES */}

      {/* PRODUCT DIALOG WINDOW */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
              className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-100 z-10"
            >
              <div className="bg-stone-950 text-white p-5 flex justify-between items-center sticky top-0 z-10">
                <h3 className="font-serif text-sm font-bold uppercase tracking-widest">
                  {editingProduct ? 'Configure Catalog Item' : 'New Catalog Item'}
                </h3>
                <button onClick={() => setIsProductModalOpen(false)} className="text-stone-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">Product Title *</label>
                    <input
                      type="text" required value={prodTitle} onChange={(e) => setProdTitle(e.target.value)}
                      className="w-full border border-stone-200 px-3 py-2 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">Department specialty *</label>
                    <select
                      value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full border border-stone-200 px-3 py-2 rounded-lg bg-stone-50"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">Price ($) *</label>
                    <input
                      type="number" required value={prodPrice} onChange={(e) => setProdPrice(e.target.value)}
                      className="w-full border border-stone-200 px-3 py-2 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">Original Price ($)</label>
                    <input
                      type="number" value={prodOrigPrice} onChange={(e) => setProdOrigPrice(e.target.value)}
                      className="w-full border border-stone-200 px-3 py-2 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">Aesthetic Rating</label>
                    <input
                      type="number" step="0.1" value={prodRating} onChange={(e) => setProdRating(e.target.value)}
                      className="w-full border border-stone-200 px-3 py-2 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">Status</label>
                    <select
                      value={prodStock} onChange={(e) => setProdStock(e.target.value as any)}
                      className="w-full border border-stone-200 px-3 py-2 rounded-lg bg-stone-50"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Product Image Asset</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-3.5 rounded-lg bg-stone-50/50">
                    <div className="space-y-1">
                      <p className="font-semibold text-stone-500 text-[10px]">Method A: Direct upload (Recommended)</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setProdFile(e.target.files[0]);
                        }}
                        className="w-full border bg-white px-2 py-1.5 rounded text-[10px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-stone-500 text-[10px]">Method B: Web URL fallback</p>
                      <input
                        type="text"
                        placeholder="https://unsplash.com/..."
                        value={prodImageUrl}
                        onChange={(e) => setProdImageUrl(e.target.value)}
                        className="w-full border bg-white px-2.5 py-1.5 rounded text-[10px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-stone-700">Item Specifications (Flexible Blueprint Row)</label>
                  <div className="border border-stone-150 rounded-xl p-4 bg-stone-50/50 space-y-3">
                    <div className="flex justify-between items-center border-b pb-1.5">
                      <span className="text-[10px] font-bold text-stone-500">Key Specification List</span>
                      <button
                        type="button" onClick={addSpecItem}
                        className="bg-stone-900 text-white font-bold px-2 py-1 rounded text-[10px]"
                      >
                        + Add Spec
                      </button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {prodSpecs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex gap-2 items-center">
                          <input
                            type="text" placeholder="e.g. Dimensions" value={spec.key}
                            onChange={(e) => updateSpecItem(sIdx, 'key', e.target.value)}
                            className="flex-1 border bg-white px-2.5 py-1 rounded"
                          />
                          <input
                            type="text" placeholder="e.g. 30 in x 20 in" value={spec.value}
                            onChange={(e) => updateSpecItem(sIdx, 'value', e.target.value)}
                            className="flex-1 border bg-white px-2.5 py-1 rounded"
                          />
                          <button
                            type="button" onClick={() => removeSpecItem(sIdx)}
                            className="text-rose-500 hover:text-rose-600 font-bold p-1 text-[10px]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Detailed Description *</label>
                  <textarea
                    rows={3} required value={prodDesc} onChange={(e) => setProdDesc(e.target.value)}
                    placeholder="Enter thorough item description details..."
                    className="w-full border border-stone-200 px-3 py-2 rounded-lg resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox" id="fcheck" checked={prodFeatured}
                    onChange={(e) => setProdFeatured(e.target.checked)}
                    className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-stone-300 rounded"
                  />
                  <label htmlFor="fcheck" className="font-bold text-stone-700">Pin as Featured (Home Collection Carousel)</label>
                </div>

                {modalError && <p className="text-rose-500 font-bold">{modalError}</p>}
                {modalSuccess && <p className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={14} /> {modalSuccess}</p>}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button" onClick={() => setIsProductModalOpen(false)}
                    className="border border-stone-200 px-4 py-2 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-stone-950 px-5 py-2 rounded-lg font-bold"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CATEGORY DIALOG WINDOW */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-100 z-10"
            >
              <div className="bg-stone-950 text-white p-5 flex justify-between items-center">
                <h3 className="font-serif text-sm font-bold uppercase tracking-widest">
                  {editingCategory ? 'Edit Area Department' : 'New Area Department'}
                </h3>
                <button onClick={() => setIsCategoryModalOpen(false)} className="text-stone-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="p-6 space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Department Name *</label>
                  <input
                    type="text" required value={catName}
                    onChange={(e) => {
                      setCatName(e.target.value);
                      if (!editingCategory) setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'));
                    }}
                    placeholder="e.g. Living Room Accents"
                    className="w-full border border-stone-200 px-3 py-2 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Slug Identifier *</label>
                  <input
                    type="text" required value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                    placeholder="e.g. living-room-accents"
                    className="w-full border border-stone-200 px-3 py-2 rounded-lg font-mono text-[10px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Department Cover Image</label>
                  <div className="border p-3 rounded bg-stone-50/50 space-y-2">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-stone-500 text-[9px]">A: File Upload (Recommended)</p>
                      <input
                        type="file" accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setCatFile(e.target.files[0]);
                        }}
                        className="w-full border bg-white px-2 py-1 text-[9px]"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-stone-500 text-[9px]">B: Web URL fallback</p>
                      <input
                        type="text" placeholder="https://unsplash.com/..." value={catImageUrl}
                        onChange={(e) => setCatImageUrl(e.target.value)}
                        className="w-full border bg-white px-2 py-1 text-[9px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Description Summary</label>
                  <textarea
                    rows={3} value={catDesc} onChange={(e) => setCatDesc(e.target.value)}
                    placeholder="Summarize the products within this aesthetic specialty..."
                    className="w-full border border-stone-200 px-3 py-2 rounded-lg resize-none"
                  />
                </div>

                {modalError && <p className="text-rose-500 font-bold">{modalError}</p>}
                {modalSuccess && <p className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={14} /> {modalSuccess}</p>}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button" onClick={() => setIsCategoryModalOpen(false)}
                    className="border border-stone-200 px-4 py-2 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-stone-950 px-5 py-2 rounded-lg font-bold"
                  >
                    {editingCategory ? 'Save Department' : 'Create Department'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[24px] border border-natural-border p-6 max-w-md w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-3.5 bg-rose-50 rounded-full">
                  <Trash2 size={22} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-natural-text-dark">Confirm Deletion</h3>
                  <p className="text-[10px] text-natural-text-muted font-normal">This action is permanent and cannot be undone.</p>
                </div>
              </div>

              <div className="text-xs text-natural-text-dark font-normal leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-natural-text-dark">"{deleteTarget.label}"</span> from MongoDB? This will remove the record permanently.
              </div>

              <div className="flex justify-end gap-3 pt-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="bg-natural-input/30 hover:bg-natural-input/60 px-5 py-2.5 rounded-full font-semibold text-natural-text-dark transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeDelete}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg"
                >
                  Delete Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Toast Notifications */}
      <AnimatePresence>
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-full shadow-lg border text-xs font-semibold ${
                toastMessage.type === 'error'
                  ? 'bg-rose-50 border-rose-100 text-rose-700'
                  : toastMessage.type === 'info'
                  ? 'bg-blue-50 border-blue-100 text-blue-700'
                  : 'bg-natural-accent border-natural-accent/10 text-white'
              }`}
            >
              {toastMessage.type === 'error' ? (
                <X size={14} />
              ) : toastMessage.type === 'info' ? (
                <Compass size={14} />
              ) : (
                <Check size={14} />
              )}
              <span>{toastMessage.text}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
