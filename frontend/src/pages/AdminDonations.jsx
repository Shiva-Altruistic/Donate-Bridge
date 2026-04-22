import { useState, useEffect } from 'react';
import { getAllDonations, getAllNGOs, updateDonationStatus, assignDonation } from '../services/api';

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donationsData, ngosData] = await Promise.all([
          getAllDonations(),
          getAllNGOs()
        ]);
        setDonations(donationsData);
        setNgos(ngosData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm('Are you sure you want to update this donation status?')) return;
    try {
      const response = await updateDonationStatus(id, newStatus);
      setDonations(donations.map(d => d._id === id ? response.donation : d));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAssignNGO = async (id, targetNgoId) => {
    if (!targetNgoId) return;
    try {
      const updatedDonation = await assignDonation(id, targetNgoId);
      setDonations(donations.map(d => d._id === id ? updatedDonation : d));
      alert('Donation successfully assigned to NGO!');
    } catch {
      alert('Failed to assign NGO');
    }
  };

  const filteredDonations = donations.filter(d => {
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    const query = searchQuery.toLowerCase();
    
    let ngoName = 'unknown ngo';
    if (d.type === 'general') ngoName = 'general fund';
    else if (d.ngoId?.name) ngoName = d.ngoId.name.toLowerCase();

    const userName = d.userId?.name ? d.userId.name.toLowerCase() : 'unknown';

    return matchesStatus && (userName.includes(query) || ngoName.includes(query));
  });

  const handleExportCSV = () => {
    if (filteredDonations.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Date', 'User Name', 'User Email', 'Category', 'NGO', 'Status', 'Amount'];
    const rows = filteredDonations.map(d => [
      new Date(d.createdAt).toLocaleDateString(),
      d.userId?.name || 'Unknown',
      d.userId?.email || 'Unknown',
      d.category,
      d.type === 'general' ? 'General Fund' : (d.ngoId?.name || 'Unknown NGO'),
      d.status || 'Pending',
      d.amount
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `donations_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="flex justify-center items-center h-full">Loading Donations...</div>;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">All Platform Donations</h2>
          <p className="text-gray-500 mt-1">Manage and assign incoming funds.</p>
        </div>
        <button onClick={handleExportCSV} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium text-sm transition-colors">
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <input 
            type="text" 
            placeholder="Search by User or NGO..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:max-w-xs px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary outline-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary outline-none bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">NGO</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                    No donations yet on DonateBridge.
                  </td>
                </tr>
              ) : (
                filteredDonations.map((donation) => (
                  <tr key={donation._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(donation.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {donation.userId?.name || 'Unknown'} <br/>
                      <span className="text-xs text-gray-400 font-normal">{donation.userId?.email}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-800">{donation.category}</td>
                    <td className="px-6 py-4 text-gray-600 min-w-[200px]">
                      {donation.type === 'general' ? (
                        <div className="flex flex-col gap-2">
                          <span className="text-primary font-medium text-xs">General Fund</span>
                          <select
                            className="text-xs border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary bg-white"
                            onChange={(e) => handleAssignNGO(donation._id, e.target.value)}
                            defaultValue=""
                          >
                            <option value="" disabled>Assign to NGO...</option>
                            {ngos.map(ngo => <option key={ngo._id} value={ngo._id}>{ngo.name}</option>)}
                          </select>
                        </div>
                      ) : donation.ngoId ? (
                        `${donation.ngoId.name} (${donation.ngoId.city})`
                      ) : 'Unknown NGO'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full inline-block text-center ${
                          donation.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                          donation.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {donation.status || 'Pending'}
                        </span>
                        <select
                          className="text-xs border border-gray-300 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-primary"
                          value={donation.status || 'Pending'}
                          onChange={(e) => handleStatusChange(donation._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-green-600 text-right whitespace-nowrap">
                      ₹{donation.amount.toLocaleString("en-IN")}
                    </td>
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
