
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import CartItem from '../components/ui/CartItem';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

const CartPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [mapCenter, setMapCenter] = useState({}); // Default fallback (San Francisco)

  const deliveryFee = 3.99;
  const serviceFee = 2.49;
  const tax = totalPrice * 0.085; // 8.5% tax
  const total = totalPrice + deliveryFee + serviceFee + tax;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error fetching location:', error);
        }
      );
    } else {
      console.error('Geolocation not supported by this browser.');
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
    console.log('Selected Location:', selectedLocation);
    // You can save selectedLocation to context or server here
  };

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: 37.7749, // Default center (example: San Francisco)
    lng: -122.4194,
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/" className="btn-primary inline-block">Browse Restaurants</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Items</h2>
              <button 
                onClick={clearCart}
                className="text-accent hover:underline text-sm"
              >
                Clear Cart
              </button>
            </div>
            <div className="divide-y">
              {cart.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="mb-6">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Service Fee</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-bold mb-2">Delivery Address</h3>
              <div className="flex border rounded-md overflow-hidden">
              <input 
  type="text" 
  value={selectedAddress}
  placeholder="Enter your address" 
  className="flex-1 p-3 focus:outline-none"
  readOnly
/>

                <button 
                  onClick={() => setIsMapOpen(true)}
                  className="bg-gray-100 px-3 text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
            
            
            <Link
  to="/checkout"
  state={{ deliveryAddress: selectedAddress }} // Pass address from state
  className="w-full btn-accent block text-center py-3"
>
  Proceed to Checkout
</Link>

          </div>
        </div>
      </div>
            {/* Popup Modal */}
            {isMapOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg w-11/12 md:w-2/3 lg:w-1/2">
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Select Delivery Location</h2>

              <LoadScript googleMapsApiKey="AIzaSyB0zc090Yi-GBjwOs7kG6iqVPR7XJPoDvo">
              <GoogleMap
  mapContainerStyle={containerStyle}
  center={selectedLocation || mapCenter}
  zoom={12}
  onClick={handleMapClick}
>
  {selectedLocation && (
    <Marker position={selectedLocation} />
  )}
</GoogleMap>

              </LoadScript>

              <div className="flex justify-end gap-4 mt-4">
                <button 
                  onClick={() => setIsMapOpen(false)} 
                  className="btn-secondary px-4 py-2"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmLocation} 
                  className="btn-primary px-4 py-2"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
