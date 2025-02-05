import React from 'react';
import { QrCode, X } from 'lucide-react';
import type { Ticket } from '../types';

export default function Tickets() {
  const [tickets, setTickets] = React.useState<Ticket[]>([]);

  React.useEffect(() => {
    // Load tickets from localStorage
    const savedTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    setTickets(savedTickets);

    // Set up interval to check ticket validity
    const interval = setInterval(() => {
      const currentTime = new Date();
      const updatedTickets = savedTickets.filter((ticket: Ticket) => 
        new Date(ticket.validTo) > currentTime
      );
      
      if (updatedTickets.length !== savedTickets.length) {
        localStorage.setItem('tickets', JSON.stringify(updatedTickets));
        setTickets(updatedTickets);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const canCancelTicket = (ticket: Ticket) => {
    const purchaseTime = new Date(ticket.validFrom).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = (currentTime - purchaseTime) / 1000 / 60; // Convert to minutes
    return timeDifference <= 5;
  };

  const handleCancelTicket = (ticketId: string) => {
    // Get the ticket to be cancelled
    const ticketToCancel = tickets.find(ticket => ticket.id === ticketId);
    if (!ticketToCancel) return;

    // Update tickets in state and localStorage
    const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));

    // Update parking space availability
    const parkingSpaces = JSON.parse(localStorage.getItem('parkingSpaces') || '[]');
    const updatedSpaces = parkingSpaces.map((space: any) => 
      space.id === ticketToCancel.parkingSpot ? { ...space, isAvailable: true } : space
    );
    localStorage.setItem('parkingSpaces', JSON.stringify(updatedSpaces));

    // Add cancellation notification
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push({
      id: Date.now().toString(),
      title: 'Ticket Cancelled',
      message: `Your parking ticket for space ${ticketToCancel.parkingSpot} has been cancelled and refunded.`,
      type: 'info',
      timestamp: new Date(),
      read: false
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Tickets</h2>
      
      {tickets.length > 0 ? (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      ticket.type === 'premium' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}
                    </span>
                    {canCancelTicket(ticket) && (
                      <button
                        onClick={() => handleCancelTicket(ticket.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                      >
                        <X className="h-4 w-4" />
                        Cancel Ticket
                      </button>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Valid from</p>
                    <p className="font-medium">{new Date(ticket.validFrom).toLocaleString()}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Valid until</p>
                    <p className="font-medium">{new Date(ticket.validTo).toLocaleString()}</p>
                  </div>
                  {ticket.parkingSpot && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Parking Spot</p>
                      <p className="font-medium">{ticket.parkingSpot}</p>
                    </div>
                  )}
                  {canCancelTicket(ticket) && (
                    <p className="text-xs text-gray-500 mt-2">
                      Cancellation available for {Math.ceil(5 - ((new Date().getTime() - new Date(ticket.validFrom).getTime()) / 1000 / 60))} more minutes
                    </p>
                  )}
                </div>
                <div className="text-center">
                  <img
                    src={ticket.qrCode}
                    alt="QR Code"
                    className="w-32 h-32"
                  />
                  <p className="text-sm text-gray-600 mt-2">Scan at terminal</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <QrCode className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Active Tickets</h3>
          <p className="mt-2 text-gray-600">Purchase a parking ticket to get started</p>
        </div>
      )}
    </div>
  );
}