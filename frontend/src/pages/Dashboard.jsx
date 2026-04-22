import { useState, useEffect } from 'react';
import { getMyDonations } from '../services/api';
import Card from '../components/Card';
import { IndianRupee, ListOrdered, Activity } from 'lucide-react';

export default function Dashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await getMyDonations();
        setDonations(data);
      } catch (error) {
        console.error('Failed to fetch donations', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const filteredDonations = donations.filter(d => filter === 'All' || d.category === filter);
  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const pendingAmount = donations.filter(d => d.status === 'Pending').reduce((sum, d) => sum + d.amount, 0);
  const completedAmount = donations.filter(d => d.status === 'Completed').reduce((sum, d) => sum + d.amount, 0);

  const categorySummary = donations.reduce((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + d.amount;
    return acc;
  }, {});

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Welcome to DonateBridge</h2>
        <p className="text-gray-500 mt-1 text-lg">Your contributions make a difference.</p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          title="Total Donated" 
          value={`₹${totalAmount.toLocaleString("en-IN")}`} 
          icon={<IndianRupee size={24} className="text-blue-600" />} 
          bgColor="bg-blue-100" 
        />
        <Card 
          title="Completed" 
          value={`₹${completedAmount.toLocaleString("en-IN")}`} 
          icon={<Activity size={24} className="text-green-600" />} 
          bgColor="bg-green-100" 
        />
        <Card 
          title="Pending" 
          value={`₹${pendingAmount.toLocaleString("en-IN")}`} 
          icon={<ListOrdered size={24} className="text-orange-600" />} 
          bgColor="bg-yellow-100" 
        />
      </div>

      {/* Category-wise Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Impact by Category</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(categorySummary).length > 0 ? Object.entries(categorySummary).map(([cat, amount]) => (
            <div key={cat} className="bg-gray-50 border border-gray-100 rounded-lg px-5 py-3 flex flex-col min-w-[140px]">
              <span className="text-sm font-medium text-gray-500 mb-1">{cat}</span>
              <span className="text-xl font-bold text-gray-800">₹{amount.toLocaleString("en-IN")}</span>
            </div>
          )) : (
            <span className="text-gray-500 text-sm">No donations yet.</span>
          )}
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Recent Activity</h3>
          <select 
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:ring-primary focus:border-primary outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Clothes">Clothes</option>
            <option value="Food">Food</option>
            <option value="Books">Books</option>
            <option value="Medical">Medical</option>
            <option value="Education">Education</option>
            <option value="Shelter">Shelter</option>
            <option value="Disaster Relief">Disaster Relief</option>
            <option value="Orphan Support">Orphan Support</option>
            <option value="Elderly Care">Elderly Care</option>
            <option value="General Fund">General Fund</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">NGO</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                    No donations yet on DonateBridge.
                  </td>
                </tr>
              ) : (
                filteredDonations.map((donation) => (
                  <tr key={donation._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {donation.category}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {donation.type === 'general' ? (
                        <span className="text-primary font-medium">General Fund</span>
                      ) : donation.ngoId ? (
                        `${donation.ngoId.name} (${donation.ngoId.city})`
                      ) : (
                        'Unknown NGO'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        donation.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                        donation.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {donation.status || 'Pending'}
                      </span>
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
