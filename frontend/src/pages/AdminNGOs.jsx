import { useState, useEffect } from 'react';
import { getAllNGOs, createNGO } from '../services/api';

export default function AdminNGOs() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  // NGO Form State
  const [ngoForm, setNgoForm] = useState({ name: '', city: '', pincode: '', address: '', type: 'Other' });
  const [isSubmittingNgo, setIsSubmittingNgo] = useState(false);

  useEffect(() => {
    getAllNGOs()
      .then(setNgos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCreateNGO = async (e) => {
    e.preventDefault();
    setIsSubmittingNgo(true);
    try {
      const newNgo = await createNGO(ngoForm);
      setNgos([...ngos, newNgo]);
      setNgoForm({ name: '', city: '', pincode: '', address: '', type: 'Other' });
      alert('NGO created successfully!');
    } catch {
      alert('Failed to create NGO');
    } finally {
      setIsSubmittingNgo(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full">Loading NGOs...</div>;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">NGO Management</h2>
        <p className="text-gray-500 mt-1">Register and manage partner organizations.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Add NGO Form */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800 mb-4">Register New NGO</h3>
          <form onSubmit={handleCreateNGO} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" required className="w-full text-sm px-3 py-2 border border-gray-300 rounded focus:ring-primary focus:border-primary outline-none" value={ngoForm.name} onChange={e => setNgoForm({ ...ngoForm, name: e.target.value })} placeholder="NGO Name" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
              <input type="text" required className="w-full text-sm px-3 py-2 border border-gray-300 rounded focus:ring-primary focus:border-primary outline-none" value={ngoForm.city} onChange={e => setNgoForm({ ...ngoForm, city: e.target.value })} placeholder="City" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Pincode *</label>
              <input type="text" required className="w-full text-sm px-3 py-2 border border-gray-300 rounded focus:ring-primary focus:border-primary outline-none" value={ngoForm.pincode} onChange={e => setNgoForm({ ...ngoForm, pincode: e.target.value })} placeholder="110001" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
              <input type="text" className="w-full text-sm px-3 py-2 border border-gray-300 rounded focus:ring-primary focus:border-primary outline-none" value={ngoForm.address} onChange={e => setNgoForm({ ...ngoForm, address: e.target.value })} placeholder="Optional" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Type *</label>
              <select className="w-full text-sm px-3 py-2 border border-gray-300 rounded focus:ring-primary focus:border-primary outline-none bg-white" value={ngoForm.type} onChange={e => setNgoForm({ ...ngoForm, type: e.target.value })}>
                <option value="Orphanage">Orphanage</option>
                <option value="Food Bank">Food Bank</option>
                <option value="Clinic">Clinic</option>
                <option value="Shelter">Shelter</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button type="submit" disabled={isSubmittingNgo} className="bg-primary text-white text-sm font-medium px-6 py-2 rounded hover:bg-primary-dark transition-colors disabled:opacity-50">
              {isSubmittingNgo ? 'Adding...' : 'Add NGO'}
            </button>
          </form>
        </div>

        {/* NGOs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">City</th>
                <th className="px-6 py-3 font-medium">Pincode</th>
                <th className="px-6 py-3 font-medium">Address</th>
                <th className="px-6 py-3 font-medium">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {ngos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">No NGOs registered on DonateBridge yet.</td>
                </tr>
              ) : (
                ngos.map((ngo) => (
                  <tr key={ngo._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{ngo.name}</td>
                    <td className="px-6 py-4">{ngo.city}</td>
                    <td className="px-6 py-4 font-medium text-gray-600">{ngo.pincode}</td>
                    <td className="px-6 py-4 truncate max-w-[200px] text-gray-500">{ngo.address || '-'}</td>
                    <td className="px-6 py-4"><span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">{ngo.type}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
