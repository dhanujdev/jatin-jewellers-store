import { MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

const storeLocations = [
  {
    city: "New Delhi",
    address: "7 Connaught Place, Ground Floor, New Delhi, 110001",
    phone: "+91 98765 43210",
    hours: "11:00 AM to 8:00 PM",
    mapLink: "https://maps.google.com/?q=Connaught+Place+New+Delhi",
  },
  {
    city: "Mumbai",
    address: "42 Linking Road, Bandra West, Mumbai, 400050",
    phone: "+91 98765 43211",
    hours: "11:00 AM to 8:00 PM",
    mapLink: "https://maps.google.com/?q=Linking+Road+Bandra+Mumbai",
  },
  {
    city: "Bengaluru",
    address: "121 Commercial Street, Bengaluru, 560001",
    phone: "+91 98765 43212",
    hours: "11:00 AM to 8:00 PM",
    mapLink: "https://maps.google.com/?q=Commercial+Street+Bengaluru",
  },
];

export default function StoreLocations() {
  return (
    <section className="py-16 relative">
      <div
        className="absolute inset-0 bg-cover bg-center z-0 opacity-20"
        style={{
          backgroundImage: "url('https://ext.same-assets.com/402991632/1540291210.jpeg')"
        }}
      ></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-playfair text-center mb-4 text-gray-800">
          Visit Our Stores
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Experience our exquisite jewelry collection in person at one of our elegantly designed stores.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {storeLocations.map((store, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{store.city}</h3>
              <div className="flex items-start mb-2">
                <MapPin size={18} className="text-gold shrink-0 mt-1 mr-2" />
                <p className="text-gray-600">{store.address}</p>
              </div>
              <div className="flex items-center mb-2">
                <Phone size={18} className="text-gold shrink-0 mr-2" />
                <a href={`tel:${store.phone.replace(/\s+/g, '')}`} className="text-gray-600 hover:text-gold">
                  {store.phone}
                </a>
              </div>
              <p className="text-gray-600 mb-4">
                <span className="font-medium">Store Hours:</span> {store.hours}
              </p>
              <a
                href={store.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-dark flex items-center text-sm font-medium"
              >
                Get Directions
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
