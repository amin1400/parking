import React from 'react';
import { Crown, Check } from 'lucide-react';

export default function Premium() {
  const [isPremiumMember, setIsPremiumMember] = React.useState(false);
  const [showPayment, setShowPayment] = React.useState(false);

  React.useEffect(() => {
    const premiumStatus = localStorage.getItem('isPremiumMember') === 'true';
    setIsPremiumMember(premiumStatus);
  }, []);

  const benefits = [
    'Unlimited parking access',
    'Reserved premium spots',
    'Priority customer support',
    'Flexible cancellation',
    'Monthly billing',
    'Special event parking'
  ];

  const handleSubscribe = () => {
    // Simulate payment processing
    setIsPremiumMember(true);
    localStorage.setItem('isPremiumMember', 'true');
    setShowPayment(false);

    // Add subscription notification
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push({
      id: Date.now().toString(),
      title: 'Welcome to Premium!',
      message: 'Your premium membership is now active. Enjoy unlimited parking!',
      type: 'success',
      timestamp: new Date(),
      read: false
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
  };

  const handleCancel = () => {
    setIsPremiumMember(false);
    localStorage.setItem('isPremiumMember', 'false');

    // Add cancellation notification
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push({
      id: Date.now().toString(),
      title: 'Premium Membership Cancelled',
      message: 'Your premium membership has been cancelled. We hope to see you again!',
      type: 'info',
      timestamp: new Date(),
      read: false
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Crown className="h-12 w-12 text-yellow-500 mx-auto" />
        <h2 className="text-2xl font-bold mt-4">Premium Membership</h2>
        <p className="text-gray-600 mt-2">
          Enhance your parking experience with exclusive benefits
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        {!isPremiumMember ? (
          <>
            <div className="text-center mb-8">
              <span className="text-4xl font-bold">€50</span>
              <span className="text-gray-600">/month</span>
            </div>

            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleSubscribe}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Subscribe Now
            </button>
          </>
        ) : (
          <div className="text-center">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full inline-block mb-4">
              Active Membership
            </div>
            <h3 className="text-xl font-medium mb-2">Welcome to Premium!</h3>
            <p className="text-gray-600 mb-6">
              Your membership is valid until {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
            <button
              onClick={handleCancel}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Cancel Membership
            </button>
          </div>
        )}
      </div>
    </div>
  );
}