import { useState, useEffect } from 'react';
import { getAllDonations, getAllUsers, getAllNGOs } from '../services/api';
import Card from '../components/Card';
import { Users, IndianRupee, ListOrdered, Building2 } from 'lucide-react';

export default function AdminOverview() {
  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donationsData, usersData, ngosData] = await Promise.all([
          getAllDonations(),
          getAllUsers(),
          getAllNGOs()
        ]);
        setDonations(donationsData);
        setUsers(usersData);
        setNgos(ngosData);
      } catch (error) {
        console.error('Failed to fetch admin data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full">Loading Overview...</div>;

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const ngoStats = donations.reduce((acc, d) => {
    if (d.type === 'general') {
      acc['General Fund'] = (acc['General Fund'] || 0) + 1;
    } else if (d.ngoId && d.ngoId.name) {
      acc[d.ngoId.name] = (acc[d.ngoId.name] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <p className="text-gray-500 mt-1">Platform overview and metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Total Donated" value={`₹${totalAmount.toLocaleString("en-IN")}`} icon={<IndianRupee size={24} className="text-green-600" />} bgColor="bg-green-100" />
        <Card title="Total Users" value={users.length} icon={<Users size={24} className="text-blue-600" />} bgColor="bg-blue-100" />
        <Card title="Total Transactions" value={donations.length} icon={<ListOrdered size={24} className="text-purple-600" />} bgColor="bg-purple-100" />
        <Card title="Registered NGOs" value={ngos.length} icon={<Building2 size={24} className="text-orange-600" />} bgColor="bg-orange-100" />
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Donations by NGO</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(ngoStats).length > 0 ? Object.entries(ngoStats).map(([ngoName, count]) => (
            <div key={ngoName} className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 flex items-center gap-3">
              <span className="font-medium text-gray-700">{ngoName}</span>
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">{count}</span>
            </div>
          )) : (
            <span className="text-gray-500 text-sm">No NGO data yet.</span>
          )}
        </div>
      </div>
    </div>
  );
}
