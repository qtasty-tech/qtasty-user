import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  FaPhone,
  FaQuestionCircle
} from 'react-icons/fa';

const milestones = [
  { id: 'pending', title: 'Order Received', description: 'Your order is being processed', icon: FaRegClock, category: 'restaurant' },
  { id: 'accepted', title: 'Order Confirmed', description: 'Restaurant has accepted your order', icon: FaStore, category: 'restaurant' },
  { id: 'preparing', title: 'Preparing', description: 'Chef is preparing your food', icon: FaUtensils, category: 'restaurant' },
  { id: 'ready', title: 'Ready for Pickup', description: 'Your order is ready for the driver', icon: FaBell, category: 'restaurant' },
  { id: 'assigned', title: 'Driver Assigned', description: 'A driver has been assigned', icon: FaMotorcycle, category: 'delivery' },
  { id: 'in-progress', title: 'Driver En Route', description: 'Driver is heading to restaurant', icon: FaTruck, category: 'delivery' },
  { id: 'pick-up', title: 'Order Picked Up', description: 'Driver has your food', icon: FaMotorcycle, category: 'delivery' },
  { id: 'en_route', title: 'On the Way', description: 'Driver is heading to you', icon: FaRoad, category: 'delivery' },
  { id: 'completed', title: 'Delivered', description: 'Your order has arrived!', icon: FaHome, category: 'delivery' },
  { id: 'cancelled', title: 'Cancelled', description: 'Your order was cancelled', icon: FaTimesCircle, category: 'special' },
  { id: 'failed', title: 'Delivery Failed', description: 'Problem with delivery', icon: FaExclamationTriangle, category: 'special' }
];

export default function DeliveryProgress() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedMilestones, setCompletedMilestones] = useState([]);
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [eventSource, setEventSource] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState('15-25 min');
  const [driverInfo, setDriverInfo] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Group milestones by category
  const restaurantMilestones = milestones.filter(m => m.category === 'restaurant');
  const deliveryMilestones = milestones.filter(m => m.category === 'delivery');
  const specialMilestones = milestones.filter(m => m.category === 'special');

  // Determine which sections to show
  const showDeliverySection = completedMilestones.includes('ready') || 
                            orderStatus === 'completed' || 
                            deliveryMilestones.some(m => completedMilestones.includes(m.id));

  // Improved progress updater with proper sequencing
  const updateProgress = (statusId) => {
    const idx = milestones.findIndex(m => m.id === statusId);
    if (idx === -1) return;

    if (statusId === 'cancelled' || statusId === 'failed') {
      setCompletedMilestones([statusId]);
      setCurrentMilestone(milestones[idx]);
      return;
    }

    // Get all milestones up to current status
    const newMilestones = [...new Set([
      ...completedMilestones,
      ...milestones
        .slice(0, idx + 1)
        .filter(m => m.category !== 'special')
        .map(m => m.id)
    ])];

    setCompletedMilestones(newMilestones);
    setCurrentMilestone(milestones[idx]);
    setLastUpdated(new Date());
  };

  // Handle SSE messages with proper status sequencing
  const handleStatusUpdate = (data) => {
    const { orderStatus, deliveryStatus, estimatedTime, driver } = data;

    if (orderStatus) {
      setOrderStatus(orderStatus);
      updateProgress(orderStatus);
    }

    if (deliveryStatus) {
      updateProgress(deliveryStatus);
    }

    if (estimatedTime) setEstimatedTime(estimatedTime);
    if (driver) setDriverInfo(driver);
  };

  // Start SSE connection for order status
  const startOrderStatusStream = () => {
    const es = new EventSource(`http://localhost:7000/api/order-status/${orderId}`);

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data) handleStatusUpdate(data);
      } catch (err) {
        console.error('SSE parse error', err);
      }
    };

    es.onerror = (err) => {
      console.error('SSE error', err);
      es.close();
      setError('Connection to order updates failed');
    };

    setEventSource(es);
    return es;
  };

  // Start SSE connection for delivery status
  const startDeliveryStatusStream = () => {
    const es = new EventSource(`http://localhost:8000/api/delivery-progress/${orderId}`);

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data) handleStatusUpdate(data);
      } catch (err) {
        console.error('SSE parse error', err);
      }
    };

    es.onerror = (err) => {
      console.error('SSE error', err);
      es.close();
    };

    setEventSource(es);
  };

  // Initial data fetch and SSE setup
  useEffect(() => {
    let alive = true;
    let es = null;

    const initializeOrderTracking = async () => {
      try {
        // First get current status via REST
        const response = await axios.get(`http://localhost:7000/api/orders/${orderId}`, {
          timeout: 5000
        });
        
        if (!alive) return;
        
        const { status, estimatedTime, driver } = response.data;
        setOrderStatus(status);
        if (estimatedTime) setEstimatedTime(estimatedTime);
        if (driver) setDriverInfo(driver);
        updateProgress(status);

        // Start appropriate SSE stream
        if (status === 'completed') {
          startDeliveryStatusStream();
        } else {
          es = startOrderStatusStream();
        }
      } catch (err) {
        if (!alive) return;
        setError('Failed to load order details');
        console.error('Error initializing order tracking:', err);
      } finally {
        alive && setIsLoading(false);
      }
    };

    initializeOrderTracking();

    return () => {
      alive = false;
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [orderId]);

  // Calculate progress for each section
  const restaurantProgress = () => {
    const completed = restaurantMilestones.filter(m => completedMilestones.includes(m.id)).length;
    return Math.round((completed / restaurantMilestones.length) * 100);
  };

  const deliveryProgress = () => {
    if (!showDeliverySection) return 0;
    const completed = deliveryMilestones.filter(m => completedMilestones.includes(m.id)).length;
    return Math.round((completed / deliveryMilestones.length) * 100);
  };

  const isSpecialState = completedMilestones.includes('cancelled') || completedMilestones.includes('failed');
  const specialState = isSpecialState
    ? milestones.find(m => completedMilestones.includes(m.id) && m.category === 'special')
    : null;

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="bg-red-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-500 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <button 
              className="text-gray-500 hover:text-[#5DAA80] transition-colors"
              onClick={() => navigate(-1)}
            >
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
                  <span className="text-[#5DAA80]">{currentMilestone?.title || 'Processing'}</span>
                )}
              </div>
              {!isSpecialState && (
                <div className="text-sm text-gray-500 mt-1">
                  Estimated arrival: {estimatedTime}
                </div>
              )}
            </div>
            {driverInfo && (
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {driverInfo.photo ? (
                    <img src={driverInfo.photo} alt="Driver" className="w-full h-full object-cover" />
                  ) : (
                    <FaMotorcycle className="text-gray-500" />
                  )}
                </div>
                <div className="ml-2">
                  <div className="text-sm font-medium">{driverInfo.name}</div>
                  <div className="text-xs text-gray-500">{driverInfo.vehicle}</div>
                </div>
              </div>
            )}
          </div>

          {/* Horizontal Progress Bar */}
          {!isSpecialState && (
            <div className="mt-6">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-700 ease-in-out"
                  style={{ 
                    width: `${(restaurantProgress() + deliveryProgress()) / 2}%`, 
                    backgroundColor: '#5DAA80' 
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1 text-right">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-md rounded-b-xl overflow-hidden divide-y divide-gray-100">
          {isSpecialState ? (
            <div className="p-6 flex flex-col items-center text-center">
              <div className={`rounded-full h-20 w-20 flex items-center justify-center mb-4 ${specialState.id === 'cancelled' ? 'bg-red-50' : 'bg-orange-50'}`}>
                <specialState.icon className={`h-8 w-8 ${specialState.id === 'cancelled' ? 'text-red-500' : 'text-orange-500'}`} />
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm uppercase text-gray-500 font-semibold">Restaurant</h3>
                  <span className="text-xs font-medium text-[#5DAA80]">
                    {restaurantProgress()}% complete
                  </span>
                </div>
                
                <div className="relative">
                  {/* Progress rail */}
                  <div className="absolute left-4 top-0 w-1 h-full bg-gray-200 rounded-full">
                    <div
                      className="absolute left-0 top-0 w-1 transition-all duration-700"
                      style={{
                        height: `${restaurantProgress()}%`,
                        backgroundColor: '#5DAA80',
                      }}
                    />
                  </div>

                  {/* Milestones */}
                  <div className="space-y-6">
                    {restaurantMilestones.map((m) => {
                      const done = completedMilestones.includes(m.id);
                      const current = currentMilestone?.id === m.id;
                      const upcoming = !done && !current && 
                                     restaurantMilestones.slice(0, restaurantMilestones.findIndex(x => x.id === m.id))
                                     .some(x => completedMilestones.includes(x.id));

                      return (
                        <div key={m.id} className="relative flex items-start pl-8 group">
                          {/* Milestone indicator */}
                          <div className={`absolute left-4 -ml-2 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center 
                            ${done ? 'bg-[#5DAA80]' : 
                             current ? 'bg-white border-2 border-[#5DAA80]' : 
                             upcoming ? 'bg-gray-200' : 'bg-gray-100'}`}>
                            {done && <FaCheckCircle className="text-white w-2.5 h-2.5" />}
                          </div>
                          
                          {/* Milestone content */}
                          <div className={`transition-all ${done ? '' : current ? 'scale-[1.02]' : 'opacity-80'}`}>
                            <div className={`font-medium flex items-center ${done ? 'text-gray-800' : current ? 'text-[#5DAA80]' : 'text-gray-500'}`}>
                              <m.icon className={`mr-2 ${done ? 'text-[#5DAA80]' : current ? 'text-[#5DAA80]' : 'text-gray-400'}`} />
                              {m.title}
                              {current && (
                                <span className="ml-2 text-xs bg-[#5DAA80] text-white px-2 py-0.5 rounded-full">
                                  Live
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-gray-500 ml-6">{m.description}</p>
                            {current && m.id === 'ready' && driverInfo && (
                              <div className="mt-2 text-xs text-gray-500 ml-6">
                                {driverInfo.name} is on the way to the restaurant
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
              {showDeliverySection && (
                <div className="mt-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm uppercase text-gray-500 font-semibold">Delivery</h3>
                    <span className="text-xs font-medium text-[#5DAA80]">
                      {deliveryProgress()}% complete
                    </span>
                  </div>
                  
                  <div className="relative">
                    {/* Progress rail */}
                    <div className="absolute left-4 top-0 w-1 h-full bg-gray-200 rounded-full">
                      <div
                        className="absolute left-0 top-0 w-1 transition-all duration-700"
                        style={{
                          height: `${deliveryProgress()}%`,
                          backgroundColor: '#5DAA80',
                        }}
                      />
                    </div>

                    {/* Milestones */}
                    <div className="space-y-6">
                      {deliveryMilestones.map((m) => {
                        const done = completedMilestones.includes(m.id);
                        const current = currentMilestone?.id === m.id;
                        const upcoming = !done && !current && 
                                       deliveryMilestones.slice(0, deliveryMilestones.findIndex(x => x.id === m.id))
                                       .some(x => completedMilestones.includes(x.id));

                        return (
                          <div key={m.id} className="relative flex items-start pl-8 group">
                            {/* Milestone indicator */}
                            <div className={`absolute left-4 -ml-2 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center 
                              ${done ? 'bg-[#5DAA80]' : 
                               current ? 'bg-white border-2 border-[#5DAA80]' : 
                               upcoming ? 'bg-gray-200' : 'bg-gray-100'}`}>
                              {done && <FaCheckCircle className="text-white w-2.5 h-2.5" />}
                            </div>
                            
                            {/* Milestone content */}
                            <div className={`transition-all ${done ? '' : current ? 'scale-[1.02]' : 'opacity-80'}`}>
                              <div className={`font-medium flex items-center ${done ? 'text-gray-800' : current ? 'text-[#5DAA80]' : 'text-gray-500'}`}>
                                <m.icon className={`mr-2 ${done ? 'text-[#5DAA80]' : current ? 'text-[#5DAA80]' : 'text-gray-400'}`} />
                                {m.title}
                                {current && (
                                  <span className="ml-2 text-xs bg-[#5DAA80] text-white px-2 py-0.5 rounded-full">
                                    Live
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-sm text-gray-500 ml-6">{m.description}</p>
                              {current && m.id === 'en_route' && driverInfo && (
                                <div className="mt-2 text-xs text-gray-500 ml-6">
                                  {driverInfo.name} is about {estimatedTime} away
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Support Section */}
        <div className="mt-4 bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaQuestionCircle className="text-[#5DAA80] mr-3" size={20} />
              <div>
                <h3 className="font-medium text-gray-800">Need help with your order?</h3>
                <p className="text-sm text-gray-500 mt-1">Our support team is here to assist you</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="bg-white border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <FaPhone className="mr-2" size={14} />
                Call
              </button>
              <button className="bg-[#5DAA80] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#4A9270] transition-colors">
                Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}