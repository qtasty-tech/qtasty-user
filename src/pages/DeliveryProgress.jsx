// src/components/DeliveryProgress.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  FaRegClock,
  FaStore,
  FaUtensils,
  FaBell,
  FaCheckCircle,
  FaTimesCircle,
  FaMotorcycle,
  FaTruck,
  FaRoad,
  FaHome,
  FaExclamationTriangle,
  FaArrowLeft,
  FaPhoneAlt
} from 'react-icons/fa';
import axios from 'axios';

// ───────────────────────────────────────────────────────────────────────────────
// Milestone definitions with category grouping
// ───────────────────────────────────────────────────────────────────────────────
const milestones = [
  // — Order flow
  { id: 'pending',     title: 'Order Received',      description: 'Your order is being processed',            icon: FaRegClock,      category: 'restaurant' },
  { id: 'accepted',    title: 'Order Confirmed',     description: 'Restaurant has accepted your order',        icon: FaStore,         category: 'restaurant' },
  { id: 'preparing',   title: 'Preparing',           description: 'Chef is preparing your food',               icon: FaUtensils,      category: 'restaurant' },
  { id: 'ready',       title: 'Ready for Pickup',    description: 'Your order is ready for the driver',        icon: FaBell,          category: 'restaurant' },

  // — Delivery flow
  { id: 'assigned',    title: 'Driver Assigned',     description: 'A driver has been assigned to your order',  icon: FaMotorcycle,    category: 'delivery' },
  { id: 'in-progress', title: 'Driver to Restaurant',description: 'Driver is heading to the restaurant',       icon: FaTruck,         category: 'delivery' },
  { id: 'pick-up',     title: 'Order Picked Up',     description: 'Driver has your food and is leaving',       icon: FaMotorcycle,    category: 'delivery' },
  { id: 'en_route',    title: 'On the Way',          description: 'Driver is heading to your location',        icon: FaRoad,          category: 'delivery' },
  { id: 'completed',   title: 'Delivered',           description: 'Your order has arrived safely!',            icon: FaHome,          category: 'delivery' },

  // — Special states (not shown in regular flow)
  { id: 'cancelled',   title: 'Cancelled',           description: 'Your order was cancelled',                  icon: FaTimesCircle,   category: 'special' },
  { id: 'failed',      title: 'Delivery Failed',     description: 'There was a problem with your delivery',    icon: FaExclamationTriangle, category: 'special' },
];

export default function DeliveryProgress() {
  const { orderId } = useParams();

  // ───────────────────────────────────────────────────────────────────────────
  // UI State
  // ───────────────────────────────────────────────────────────────────────────
  const [isLoading, setIsLoading]             = useState(true);
  const [error, setError]                     = useState(null);
  const [completedMilestones, setCompletedMilestones] = useState([]);
  const [currentMilestone, setCurrentMilestone]       = useState(0);
  const [deliveryDetails, setDeliveryDetails]         = useState(null);

  // ───────────────────────────────────────────────────────────────────────────
  // Filter & group milestones
  // ───────────────────────────────────────────────────────────────────────────
  const regularMilestones     = milestones.filter(m => m.category !== 'special');
  const restaurantMilestones  = regularMilestones.filter(m => m.category === 'restaurant');
  const deliveryMilestones    = regularMilestones.filter(m => m.category === 'delivery');

  // ───────────────────────────────────────────────────────────────────────────
  // Progress updater
  // ───────────────────────────────────────────────────────────────────────────
  const updateProgress = (statusId) => {
    const idx = milestones.findIndex(m => m.id === statusId);
    if (idx === -1) return;

    // Special handling for cancelled/failed
    if (statusId === 'cancelled' || statusId === 'failed') {
      setCompletedMilestones([statusId]);
      setCurrentMilestone(idx);
      return;
    }

    // Build the list of done IDs
    const doneIds = [
      ...milestones
        .slice(0, idx)
        .filter(m => m.category !== 'special')
        .map(m => m.id),
      statusId,
    ];

    setCompletedMilestones(doneIds);
    setCurrentMilestone(idx);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Fetch initial status once
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    axios.get(`/api/orders/${orderId}`)
      .then(res => {
        if (!alive) return;
        const initial = res.data.deliveryStatus;
        if (initial) updateProgress(initial);
      })
      .catch(() => {
        if (!alive) return;
        setError('Failed to load order details');
      })
      .finally(() => alive && setIsLoading(false));

    return () => { alive = false; };
  }, [orderId]);

  // ───────────────────────────────────────────────────────────────────────────
  // SSE listener for live updates
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const es = new EventSource(`http://localhost:8000/api/delivery-progress/${orderId}`);

    es.onmessage = e => {
      try {
        const { deliveryStatus } = JSON.parse(e.data);
        if (deliveryStatus) updateProgress(deliveryStatus);
      } catch (err) {
        console.error('SSE parse error', err);
      }
    };
    es.onerror = err => {
      console.error('SSE error', err);
      es.close();
    };
    return () => es.close();
  }, [orderId]);

  // ───────────────────────────────────────────────────────────────────────────
  // Progress percentage for the horizontal bar
  // ───────────────────────────────────────────────────────────────────────────
  const calculateProgress = () => {
    if (completedMilestones.includes('cancelled') || completedMilestones.includes('failed')) {
      return 0;
    }
    const regularTotal   = regularMilestones.length;
    const completedCount = completedMilestones.length;
    return Math.min(100, Math.round((completedCount / regularTotal) * 100));
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Loading / Error UIs
  // ───────────────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#5DAA80]"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Loading your order...</p>
          <p className="mt-2 text-sm text-gray-500">This won't take long</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="bg-red-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-500 w-8 h-8"/>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-gray-500 mb-6">
            Order ID: <span className="font-medium">{orderId}</span>
          </p>
          <button
            className="bg-[#5DAA80] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#4A9270] transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Special states handling
  const isSpecialState = completedMilestones.includes('cancelled') || completedMilestones.includes('failed');
  const specialState   = isSpecialState
    ? milestones.find(m => completedMilestones.includes(m.id) && m.category === 'special')
    : null;

  // Current active milestone
  const activeMilestone = milestones[currentMilestone];

  // ───────────────────────────────────────────────────────────────────────────
  // Main UI
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <button className="text-gray-500 hover:text-[#5DAA80] transition-colors">
              <FaArrowLeft size={18} />
            </button>
            <h1 className="ml-4 text-2xl font-bold text-gray-800">Order Status</h1>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Order #{orderId}</div>
              <div className="text-lg font-medium mt-1">
                {isSpecialState ? (
                  <span className={specialState.id === 'cancelled' ? 'text-red-500' : 'text-orange-500'}>
                    {specialState.title}
                  </span>
                ) : (
                  <span className="text-[#5DAA80]">{activeMilestone.title}</span>
                )}
              </div>
            </div>
          </div>

          {/* Horizontal Progress Bar */}
          {!isSpecialState && (
            <div className="mt-6">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-700 ease-in-out"
                  style={{ width: `${calculateProgress()}%`, backgroundColor: '#5DAA80' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-md rounded-b-xl overflow-hidden divide-y divide-gray-100">
          {isSpecialState ? (
            <div className="p-6 flex flex-col items-center text-center">
              <div className={`rounded-full h-20 w-20 flex items-center justify-center mb-4 ${
                specialState.id === 'cancelled' ? 'bg-red-50' : 'bg-orange-50'
              }`}>
                <specialState.icon className={`h-8 w-8 ${
                  specialState.id === 'cancelled' ? 'text-red-500' : 'text-orange-500'
                }`} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{specialState.title}</h3>
              <p className="text-gray-600 mb-6">{specialState.description}</p>
              <button className="bg-[#5DAA80] text-white font-medium px-6 py-2 rounded-lg hover:bg-[#4A9270] transition-colors">
                Contact Support
              </button>
            </div>
          ) : (
            <div className="p-6">
              {/* Restaurant Section */}
              <div className="mb-8">
                <h3 className="text-sm uppercase text-gray-500 font-semibold mb-4">Restaurant</h3>
                <div className="relative">
                  {/* Vertical rail */}
                  <div className="absolute left-4 top-0 w-1 h-full bg-gray-200 rounded-full">
                    <div
                      className="absolute left-0 top-0 w-1 transition-all duration-700"
                      style={{
                        height: `${
                          (restaurantMilestones.filter(m => completedMilestones.includes(m.id)).length /
                          restaurantMilestones.length) *
                          100
                        }%`,
                        backgroundColor: '#5DAA80',
                      }}
                    />
                  </div>

                  {/* Milestones */}
                  <div className="space-y-8">
                    {restaurantMilestones.map((m, idx) => {
                      const done    = completedMilestones.includes(m.id);
                      const current = m.id === activeMilestone.id;
                      const Icon    = m.icon;

                      return (
                        <div key={`${m.id}-${idx}`} className="relative flex items-start pl-8">
                          <div
                            className={`absolute left-4 -ml-2 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                              done ? 'bg-[#5DAA80]' : current ? 'bg-[#5DAA80]/10 border-2 border-[#5DAA80]' : 'bg-gray-200'
                            }`}
                          >
                            {done && <FaCheckCircle className="text-white w-2.5 h-2.5" />}
                          </div>
                          <div>
                            <div className={`font-medium ${
                              done ? 'text-gray-800' : current ? 'text-[#5DAA80]' : 'text-gray-500'
                            }`}>
                              {m.title}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{m.description}</p>
                            {current && (
                              <div className="mt-2 flex items-center text-xs text-[#5DAA80] font-medium">
                                <div className="w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse" style={{ backgroundColor: '#5DAA80' }} />
                                In progress
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Delivery Section */}
              <div>
                <h3 className="text-sm uppercase text-gray-500 font-semibold mb-4">Delivery</h3>
                <div className="relative">
                  {/* Vertical rail */}
                  <div className="absolute left-4 top-0 w-1 h-full bg-gray-200 rounded-full">
                    <div
                      className="absolute left-0 top-0 w-1 transition-all duration-700"
                      style={{
                        height: `${
                          (deliveryMilestones.filter(m => completedMilestones.includes(m.id)).length /
                          deliveryMilestones.length) *
                          100
                        }%`,
                        backgroundColor: '#5DAA80',
                      }}
                    />
                  </div>

                  {/* Milestones */}
                  <div className="space-y-8">
                    {deliveryMilestones.map((m, idx) => {
                      const done    = completedMilestones.includes(m.id);
                      const current = m.id === activeMilestone.id;
                      const Icon    = m.icon;

                      // Only show once restaurant is ready or in-progress
                      const shouldShow =
                        completedMilestones.includes('ready') ||
                        done ||
                        current ||
                        idx === 0;
                      if (!shouldShow) return null;

                      return (
                        <div key={`${m.id}-${idx}`} className="relative flex items-start pl-8">
                          <div
                            className={`absolute left-4 -ml-2 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                              done ? 'bg-[#5DAA80]' : current ? 'bg-[#5DAA80]/10 border-2 border-[#5DAA80]' : 'bg-gray-200'
                            }`}
                          >
                            {done && <FaCheckCircle className="text-white w-2.5 h-2.5" />}
                          </div>
                          <div>
                            <div className={`font-medium ${
                              done ? 'text-gray-800' : current ? 'text-[#5DAA80]' : 'text-gray-500'
                            }`}>
                              {m.title}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{m.description}</p>
                            {current && (
                              <div className="mt-2 flex items-center text-xs text-[#5DAA80] font-medium">
                                <div className="w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse" style={{ backgroundColor: '#5DAA80' }} />
                                In progress
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Support Section */}
        <div className="mt-4 bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">Need help with your order?</h3>
              <p className="text-sm text-gray-500 mt-1">Our support team is here to assist you</p>
            </div>
            <button className="bg-[#5DAA80] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#4A9270] transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
