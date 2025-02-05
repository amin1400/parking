import React from 'react';
import { MapPin, Clock, CreditCard, X } from 'lucide-react';
import type { ParkingSpace } from '../types';

export default function Home() {
  const [parkingSpaces, setParkingSpaces] = React.useState<ParkingSpace[]>([
    { id: 'S1', type: 'standard', isAvailable: true, location: 'A1' },
    { id: 'S2', type: 'standard', isAvailable: false, location: 'A2' },
    { id: 'P1', type: 'premium', isAvailable: true, location: 'B1' },
    { id: 'P2', type: 'premium', isAvailable: true, location: 'B2' },
  ]);

  const [selectedType, setSelectedType] = React.useState<'standard' | 'premium'>('standard');
  const [duration, setDuration] = React.useState(1);
  const [showPayment, setShowPayment] = React.useState(false);
  const [selectedSpace, setSelectedSpace] = React.useState<string | null>(null);
  const [isPremiumMember, setIsPremiumMember] = React.useState(false);

  React.useEffect(() => {
    const premiumStatus = localStorage.getItem('isPremiumMember') === 'true';
    setIsPremiumMember(premiumStatus);
  }, []);

  const pricing = {
    standard: 2.5,
    premium: 5,
  };

  const totalPrice = isPremiumMember ? 0 : pricing[selectedType] * duration;

  const paymentMethods = [
    { id: 'card', name: 'Credit Card', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'paypal', name: 'PayPal', icon: <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" className="h-5 w-5" /> },
    { id: 'apple', name: 'Apple Pay', icon: <img src="https://www.apple.com/v/apple-pay/i/images/overview/og_image.png?202310271444" alt="Apple Pay" className="h-5 w-5" /> },
    { id: 'google', name: 'Google Pay', icon: <img src="https://www.gstatic.com/pay/images/google_pay_mark_800.png" alt="Google Pay" className="h-5 w-5" /> },
  ];

  const availableSpaces = parkingSpaces.filter(
    space => space.type === selectedType && space.isAvailable
  ).length;

  const handleSpaceSelection = (spaceId: string) => {
    setSelectedSpace(spaceId);
  };

  const handlePayment = (paymentMethod: string) => {
    // Generate QR code data
    const ticketData = {
      id: Math.random().toString(36).substr(2, 9),
      type: selectedType,
      validFrom: new Date(),
      validTo: new Date(Date.now() + duration * 60 * 60 * 1000),
      parkingSpot: selectedSpace,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TICKET-${Math.random().toString(36).substr(2, 9)}`
    };

    // Get existing tickets from localStorage
    const existingTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    
    // Add new ticket
    const updatedTickets = [...existingTickets, ticketData];
    
    // Save to localStorage
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));

    // Update parking space availability
    const updatedSpaces = parkingSpaces.map(space => 
      space.id === selectedSpace ? { ...space, isAvailable: false } : space
    );
    setParkingSpaces(updatedSpaces);

    // Add purchase notification
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push({
      id: Date.now().toString(),
      title: 'Parking Space Booked',
      message: `Successfully booked ${selectedType} parking space ${selectedSpace} for ${duration} hour${duration > 1 ? 's' : ''}.`,
      type: 'success',
      timestamp: new Date(),
      read: false
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));

    // Close payment modal and reset selection
    setShowPayment(false);
    setSelectedSpace(null);

    // Navigate to tickets page
    window.history.pushState({}, '', '/tickets');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Book Parking Space</h2>
        
        {/* Parking Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Parking Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedType('standard')}
              className={`p-4 rounded-lg border ${
                selectedType === 'standard'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <h3 className="font-semibold">Standard</h3>
              <p className="text-sm text-gray-600">
                {isPremiumMember ? 'Free' : `€${pricing.standard}/hour`}
              </p>
            </button>
            <button
              onClick={() => setSelectedType('premium')}
              className={`p-4 rounded-lg border ${
                selectedType === 'premium'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <h3 className="font-semibold">Premium</h3>
              <p className="text-sm text-gray-600">
                {isPremiumMember ? 'Free' : `€${pricing.premium}/hour`}
              </p>
            </button>
          </div>
        </div>

        {/* Duration Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (hours)
          </label>
          <input
            type="range"
            min="1"
            max="24"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{duration} hours</span>
            <span>{isPremiumMember ? 'Free' : `€${totalPrice.toFixed(2)}`}</span>
          </div>
        </div>

        {/* Available Spaces */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">
              Available Spaces
            </h3>
            <span className="text-xs text-gray-500">
              {availableSpaces} space{availableSpaces !== 1 ? 's' : ''} available
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {parkingSpaces
              .filter((space) => space.type === selectedType)
              .map((space) => (
                <button
                  key={space.id}
                  onClick={() => space.isAvailable && handleSpaceSelection(space.id)}
                  className={`p-2 text-center rounded ${
                    space.isAvailable
                      ? selectedSpace === space.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800'
                  }`}
                  disabled={!space.isAvailable}
                >
                  {space.location}
                </button>
              ))}
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={() => selectedSpace && setShowPayment(true)}
          disabled={!selectedSpace}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isPremiumMember ? 'Book Space' : `Pay €${totalPrice.toFixed(2)}`}
        </button>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <MapPin className="h-6 w-6 text-blue-600 mb-2" />
          <h3 className="font-medium">Location</h3>
          <p className="text-sm text-gray-600">Terminal 1 Parking</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Clock className="h-6 w-6 text-blue-600 mb-2" />
          <h3 className="font-medium">24/7 Access</h3>
          <p className="text-sm text-gray-600">Always available</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <CreditCard className="h-6 w-6 text-blue-600 mb-2" />
          <h3 className="font-medium">Secure Payment</h3>
          <p className="text-sm text-gray-600">Multiple options</p>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Select Payment Method</h3>
              <button
                onClick={() => setShowPayment(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handlePayment(method.id)}
                  className="w-full flex items-center p-4 border rounded-lg hover:bg-gray-50"
                >
                  <span className="mr-3">{method.icon}</span>
                  <span className="font-medium">{method.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}