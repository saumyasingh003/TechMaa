import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, amount, onSuccess, onFailure, currency = "$" }) => {
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const isSuccess = Math.random() < 0.9; // 90% success rate
      setStatus(isSuccess ? 'success' : 'error');
      setProcessing(false);

      // Call the appropriate callback after a delay
      setTimeout(() => {
        if (isSuccess) {
          onSuccess();
        } else {
          onFailure();
        }
        // Reset the form
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        setStatus(null);
      }, 2000);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          disabled={processing}
        >
          <X className="size-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Complete Purchase</h2>
          <p className="text-gray-600 mt-1">Amount: {currency}{amount}</p>
        </div>

        {status === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle2 className="size-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600">Redirecting to your course...</p>
          </div>
        ) : status === 'error' ? (
          <div className="text-center py-8">
            <AlertCircle className="size-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h3>
            <p className="text-gray-600">Please try again or use a different payment method.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="text"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1234 5678 9012 3456"
                  pattern="[0-9]{16}"
                  required
                  disabled={processing}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiry"
                  value={expiryDate}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 2) {
                      setExpiryDate(value);
                    } else {
                      setExpiryDate(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="MM/YY"
                  pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                  required
                  disabled={processing}
                />
              </div>

              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123"
                  pattern="[0-9]{3}"
                  required
                  disabled={processing}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 bg-[#FED642] text-gray-900 rounded-lg font-semibold hover:bg-[#e5c13b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FED642] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {processing ? 'Processing...' : `Pay ${currency}${amount}`}
            </button>

            <div className="text-center text-sm text-gray-500 mt-4">
              <p>This is a test payment system.</p>
              <p>Use any valid-looking card details.</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;