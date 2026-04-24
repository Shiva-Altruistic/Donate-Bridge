import { useLocation, Link, Navigate } from 'react-router-dom';
import { Download, ArrowLeft, CheckCircle } from 'lucide-react';

export default function Receipt() {
  const location = useLocation();
  const donation = location.state?.donation;

  if (!donation) {
    return <Navigate to="/dashboard" replace />;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 py-8">
      <div className="flex justify-between items-center print:hidden">
        <Link to="/dashboard" className="text-gray-500 hover:text-gray-800 flex items-center gap-2 font-medium transition-colors">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        <button 
          onClick={handlePrint}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Download size={18} /> Download PDF
        </button>
      </div>

      {/* Receipt Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 print:shadow-none print:border-none print:p-0">
        <div className="text-center mb-8">
          <CheckCircle className="text-green-500 mx-auto mb-3" size={48} />
          <h2 className="text-3xl font-bold text-gray-800">Donation Successful!</h2>
          <p className="text-gray-500 mt-2">Thank you for your generous contribution.</p>
        </div>

        <div className="border-t border-b border-gray-100 py-6 my-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Transaction ID</span>
            <span className="font-mono text-gray-800 font-medium">{donation.paymentId || donation._id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Date</span>
            <span className="text-gray-800 font-medium">{new Date(donation.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Status</span>
            <span className="text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full text-sm border border-green-100 flex items-center gap-1">
              <CheckCircle size={14} /> Completed
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Destination</span>
            <span className="text-gray-800 font-medium">
              {donation.type === 'general' ? 'General Fund' : (donation.ngoId?.name || 'Unknown NGO')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Category</span>
            <span className="text-gray-800 font-medium">{donation.category}</span>
          </div>
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-6 rounded-xl print:bg-transparent print:px-0 print:border-t print:border-gray-200">
          <span className="text-gray-600 font-medium text-lg">Total Amount</span>
          <span className="text-3xl font-bold text-green-600">₹{donation.amount.toLocaleString("en-IN")}</span>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>This is a computer-generated receipt.</p>
          <p>Donate Bridge Platform &bull; support@Donatebridge.org</p>
        </div>
      </div>
    </div>
  );
}
