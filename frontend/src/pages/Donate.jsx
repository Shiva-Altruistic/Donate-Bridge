import { useState, useEffect } from 'react';
import { createDonation, getAllNGOs } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Select from 'react-select';

export default function Donate() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Clothes');
  const [donationType, setDonationType] = useState('ngo');
  const [ngoId, setNgoId] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  const selectedNgo = ngos.find(n => n._id === ngoId);

  useEffect(() => {
    getAllNGOs().then(setNgos).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (!amount || amount <= 0) {
        setError('Amount must be greater than 0');
        setIsSubmitting(false);
        return;
      }
      if (!category) {
        setError('Category is required');
        setIsSubmitting(false);
        return;
      }
      if (donationType === 'ngo' && !ngoId) {
        setError('Please select an NGO');
        setIsSubmitting(false);
        return;
      }

      // Open Dummy Payment Modal instead of real Razorpay
      setShowPaymentModal(true);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process donation');
      setIsSubmitting(false);
    }
  };

  const handleDummyPayment = async () => {
    alert('Payment Successful');
    setShowPaymentModal(false);

    try {
      const dummyPaymentId = 'pay_dummy_' + Date.now();
      const donationResult = await createDonation(
        Number(amount),
        category,
        donationType,
        ngoId,
        dummyPaymentId
      );
      navigate('/receipt', { state: { donation: donationResult } });
    } catch {
      setError('Payment succeeded but failed to save donation. Please contact support.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Donate with DonateBridge</h2>
            <p className="text-sm text-gray-500 mt-1">Secure and transparent donation platform</p>
          </div>
        </div>

        <div className="p-8">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-100">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Category <span className="text-red-500">*</span></label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
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
                <option value="Other">Other</option></select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Donation Amount (₹) <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">₹</span>
                </div>
                <input
                  type="number"
                  min="1"
                  required
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Donation Destination</label>
              <div className="flex gap-4">
                <label className={`flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${donationType === 'ngo' ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  <input type="radio" name="donationType" value="ngo" checked={donationType === 'ngo'} onChange={() => setDonationType('ngo')} className="hidden" />
                  Specific NGO
                </label>
                <label className={`flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${donationType === 'general' ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  <input type="radio" name="donationType" value="general" checked={donationType === 'general'} onChange={() => setDonationType('general')} className="hidden" />
                  General Fund
                </label>
              </div>
            </div>

            {donationType === 'ngo' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select NGO <span className="text-red-500">*</span></label>
                <Select
                  options={ngos.map(ngo => ({ value: ngo._id, label: `${ngo.name} (${ngo.city})` }))}
                  onChange={(option) => setNgoId(option ? option.value : null)}
                  placeholder="Search for an NGO..."
                  isClearable
                  required
                  styles={{
                    control: (base) => ({
                      ...base,
                      padding: '6px',
                      borderRadius: '0.5rem',
                      borderColor: '#D1D5DB',
                    })
                  }}
                />
                {selectedNgo && (
                  <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-800">{selectedNgo.name}</h4>
                    <div className="mt-2 text-sm text-gray-600 flex flex-col gap-1">
                      <p><span className="font-medium text-gray-700">City:</span> {selectedNgo.city}</p>
                      <p><span className="font-medium text-gray-700">Pincode:</span> {selectedNgo.pincode}</p>
                      {selectedNgo.address && <p><span className="font-medium text-gray-700">Address:</span> {selectedNgo.address}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition-colors shadow-sm flex justify-center items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Processing...' : 'Donate Now'}
            </button>
          </form>
        </div>
      </div>

      {/* Dummy Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#02042b] p-6 text-white text-center"> {/* Razorpay dark blue */}
              <h3 className="text-lg font-medium opacity-90">Secure Payment</h3>
              <p className="text-sm mt-1 opacity-75">
                {donationType === 'ngo' && selectedNgo ? selectedNgo.name : 'General Fund'}
              </p>
              <div className="text-3xl font-bold mt-4">₹{Number(amount).toLocaleString("en-IN")}</div>
            </div>
            <div className="p-6">
              <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2 overflow-x-auto">
                <button className="text-[#3399cc] font-medium border-b-2 border-[#3399cc] pb-2 px-1 whitespace-nowrap">Cards</button>
                <button className="text-gray-500 font-medium pb-2 px-1 whitespace-nowrap">UPI</button>
                <button className="text-gray-500 font-medium pb-2 px-1 whitespace-nowrap">Netbanking</button>
                <button className="text-gray-500 font-medium pb-2 px-1 whitespace-nowrap">Wallets</button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Card Number</label>
                  <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc] transition-all font-mono text-sm" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Expiry</label>
                    <input type="text" placeholder="MM/YY" className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc] transition-all font-mono text-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">CVV</label>
                    <input type="text" placeholder="123" className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc] transition-all font-mono text-sm" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => { setShowPaymentModal(false); setIsSubmitting(false); }}
                  className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDummyPayment}
                  className="flex-1 bg-[#3399cc] text-white py-3 rounded-md font-medium hover:bg-[#2b82ad] transition-colors shadow-sm"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
