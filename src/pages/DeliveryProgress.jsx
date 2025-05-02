import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaStore, FaUtensils, FaMotorcycle, FaHome, FaCheck } from 'react-icons/fa';
import axios from 'axios';

const milestones = [
  {
    id: 'restaurant_accept',
    title: 'Order Accepted',
    description: 'Restaurant has accepted your order',
    icon: FaStore,
    apiEndpoint: '/api/orders/check-restaurant-accept',
    completed: false
  },
  {
    id: 'preparing',
    title: 'Preparing Food',
    description: 'Restaurant is preparing your food',
    icon: FaUtensils,
    apiEndpoint: '/api/orders/check-preparing',
    completed: false
  },
  {
    id: 'rider_pickup',
    title: 'Rider Picked Up',
    description: 'Delivery rider has picked up your order',
    icon: FaMotorcycle,
    apiEndpoint: '/api/orders/check-rider-pickup',
    completed: false
  },
  {
    id: 'delivering',
    title: 'On the Way',
    description: 'Your order is on its way to you',
    icon: FaMotorcycle,
    apiEndpoint: '/api/orders/check-delivering',
    completed: false
  },
  {
    id: 'delivered',
    title: 'Delivered',
    description: 'Your order has arrived!',
    icon: FaHome,
    apiEndpoint: '/api/orders/check-delivered',
    completed: false
  }
];

const DeliveryProgress = () => {
  const { orderId } = useParams();
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [completedMilestones, setCompletedMilestones] = useState([]);

  const checkMilestoneStatus = async (milestoneIndex) => {
    if (milestoneIndex >= milestones.length) return;

    const milestone = milestones[milestoneIndex];
    
    try {
      const response = await axios.get(`${milestone.apiEndpoint}/${orderId}`);
      
      if (response.data.status === 'completed') {
        // Mark this milestone as completed
        setCompletedMilestones(prev => [...prev, milestone.id]);
        
        // Move to next milestone
        setCurrentMilestone(milestoneIndex + 1);
      }
    } catch (err) {
      console.error(`Error checking ${milestone.id} status:`, err);
      setError(`Failed to check ${milestone.title} status`);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkMilestoneStatus(currentMilestone);
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [currentMilestone]);

  // Initial data fetch
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`);
        setTrackingData(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load order details');
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading delivery status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 mx-auto flex items-center justify-center w-16 h-16 mb-4">
            <FaExclamationTriangle className="w-full h-full" />
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-gray-600">
            Please try again later or contact support with order ID: <strong>{orderId}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Order #{orderId}
          </div>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
            Delivery Status
          </h1>
          
          <div className="mt-8">
            <div className="relative">
              {/* Progress line */}
              <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200">
                <div 
                  className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-500"
                  style={{
                    height: `${(completedMilestones.length / milestones.length) * 100}%`
                  }}
                ></div>
              </div>

              {/* Milestones */}
              <div className="space-y-8">
                {milestones.map((milestone, index) => {
                  const isCompleted = completedMilestones.includes(milestone.id);
                  const isCurrent = index === currentMilestone && !isCompleted;
                  const Icon = milestone.icon;
                  
                  return (
                    <div key={milestone.id} className="relative flex items-start">
                      <div className={`absolute left-4 -ml-0.5 mt-0.5 top-4 w-3 h-3 rounded-full 
                        ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'}`}>
                        {isCompleted && <FaCheck className="text-white text-xs relative -left-0.5 -top-0.5" />}
                      </div>
                      
                      <div className="ml-10">
                        <div className={`flex items-center ${isCompleted ? 'text-green-600' : isCurrent ? 'text-yellow-600' : 'text-gray-500'}`}>
                          <Icon className="mr-2" />
                          <h3 className={`font-semibold ${isCompleted || isCurrent ? 'font-bold' : ''}`}>
                            {milestone.title}
                          </h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {milestone.description}
                        </p>
                        {isCurrent && (
                          <p className="mt-1 text-xs text-yellow-600 animate-pulse">
                            Checking status...
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {completedMilestones.length === milestones.length && (
            <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center text-green-700">
                <FaCheck className="mr-2" />
                <span className="font-semibold">Order successfully delivered!</span>
              </div>
              <p className="mt-2 text-sm text-green-600">
                Thank you for your order. We hope you enjoy your meal!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryProgress;