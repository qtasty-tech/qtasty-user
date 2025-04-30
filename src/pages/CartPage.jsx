import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import CartItem from '../components/ui/CartItem';
import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { ShoppingBag, MapPin, X, CheckCircle, ChevronRight, Trash2 } from 'lucide-react';

const CartPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // Default (San Francisco)
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const deliveryFee = 3.99;
  const serviceFee = 2.49;
  const tax = totalPrice * 0.085; // 8.5% tax
  const total = totalPrice + deliveryFee + serviceFee + tax;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(newCenter);
          setSelectedLocation(newCenter);
        },
        (error) => {
          console.error('Error fetching location:', error);
        }
      );
    }
  }, []);

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
  
    setSelectedLocation({ lat, lng });
  
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
  
      if (response.results && response.results[0]) {
        setSelectedAddress(response.results[0].formatted_address);
      } else {
        setSelectedAddress('Address not found');
      }
    } catch (error) {
      console.error('Geocoder failed:', error);
      setSelectedAddress('Address not found');
    }
  };

  const handleConfirmLocation = () => {
    setIsMapOpen(false);
    setShowConfirmation(true);
    
    // Hide confirmation after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };

  const handleClearCart = () => {
    setIsConfirmingClear(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setIsConfirmingClear(false);
  };

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 text-accent mb-6">
            <ShoppingBag size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white hover:bg-accent/90 transition-all">
            Browse Restaurants
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in">
        <header className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShoppingBag className="text-accent" size={28} />
            Your Cart
          </h1>
          <p className="text-gray-500 mt-1">Complete your order in just a few steps</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">Items ({cart.length})</h2>
                  <p className="text-sm text-gray-500 mt-1">From your favorite restaurants</p>
                </div>
                <button 
                  onClick={handleClearCart}
                  className="text-gray-500 hover:text-red-500 flex items-center gap-1 text-sm transition-colors duration-200"
                >
                  <Trash2 size={16} />
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {cart.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 border border-gray-100">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="mb-6 space-y-1">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax (8.5%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-accent">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold mb-3">Delivery Address</h3>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-accent/30 transition-all duration-200">
                  <input 
                    type="text" 
                    value={selectedAddress}
                    placeholder="Select delivery location" 
                    className="flex-1 p-3 focus:outline-none text-sm"
                    readOnly
                  />
                  <button 
                    onClick={() => setIsMapOpen(true)}
                    className="bg-gray-50 px-3 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Select location on map"
                  >
                    <MapPin size={18} />
                  </button>
                </div>
                {!selectedAddress && (
                  <p className="text-amber-600 text-xs mt-2 flex items-center gap-1">
                    <MapPin size={12} /> Please select a delivery address
                  </p>
                )}
              </div>
              
              <div className="space-y-4">
                <Link
                  to="/checkout"
                  state={{ deliveryAddress: selectedAddress }}
                  className={`w-full btn-accent block text-center py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${!selectedAddress ? 'opacity-70 pointer-events-none' : 'hover:bg-accent/90 transition-all'}`}
                  disabled={!selectedAddress}
                >
                  Proceed to Checkout
                  <ChevronRight size={18} />
                </Link>
                
                <Link to="/" className="w-full block text-center py-2 text-gray-500 text-sm hover:text-accent transition-colors">
                  Continue Shopping
                </Link>
              </div>

              {/* Estimated delivery time */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Estimated Delivery Time</p>
                    <p className="text-sm text-gray-500">25-40 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popup Modal */}
        {isMapOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl overflow-hidden shadow-xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] flex flex-col">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MapPin size={20} className="text-accent" />
                  Select Delivery Location
                </h2>
                <button 
                  onClick={() => setIsMapOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 flex-grow overflow-auto">
                <LoadScript 
                  googleMapsApiKey="AIzaSyB0zc090Yi-GBjwOs7kG6iqVPR7XJPoDvo" 
                  onLoad={() => setMapLoaded(true)}
                >
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={selectedLocation || mapCenter}
                    zoom={14}
                    onClick={handleMapClick}
                    options={{
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false,
                    }}
                  >
                    {selectedLocation && (
                      <Marker 
                        position={selectedLocation}
                        animation={window.google?.maps?.Animation?.DROP}
                      />
                    )}
                  </GoogleMap>
                </LoadScript>

                {selectedAddress && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium">Selected Address:</p>
                    <p className="text-gray-700">{selectedAddress}</p>
                  </div>
                )}

                {!mapLoaded && (
                  <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  onClick={() => setIsMapOpen(false)} 
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmLocation} 
                  className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors flex items-center gap-2 disabled:opacity-70"
                  disabled={!selectedAddress}
                >
                  <CheckCircle size={18} />
                  Confirm Location
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clear Cart Confirmation */}
        {isConfirmingClear && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl overflow-hidden shadow-xl w-11/12 max-w-md p-6">
              <h3 className="text-xl font-bold mb-4">Clear your cart?</h3>
              <p className="text-gray-600 mb-6">This will remove all items from your cart. This action cannot be undone.</p>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setIsConfirmingClear(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmClearCart}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Location Confirmation Toast */}
        {showConfirmation && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-up z-50">
            <CheckCircle size={18} />
            <span>Delivery address updated successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;