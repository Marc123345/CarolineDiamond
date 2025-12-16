import React, { useState } from 'react';
import { Gift, ArrowRight, Star, Upload, Send } from 'lucide-react';
import { Header } from '../components/Header';

interface GiftInspirationPageProps {
  onNavigate: (page: string) => void;
}

export const GiftInspirationPage: React.FC<GiftInspirationPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const giftItems = [
    {
      name: 'LAURA ARMBAND',
      price: 'Vanaf 1.750 €',
      category: "Caroline's favorites",
      image: 'https://diamondsbycs.com/images/uploads/upload-654b8faf0ff19.jpeg'
    },
    {
      name: 'YACINTHE RING',
      price: 'Vanaf 480 €',
      category: 'Budgetvriendelijk',
      image: 'https://diamondsbycs.com/images/uploads/upload-6556ae703fb6f.jpeg'
    },
    {
      name: 'MANOU OORBELLEN',
      price: 'Vanaf 250 €',
      category: 'Perfect gift',
      image: 'https://diamondsbycs.com/images/uploads/upload-6556afcfbe181.jpeg'
    },
    {
      name: 'LIEL RING',
      price: 'Vanaf 590 €',
      category: 'Tijdloos',
      image: 'https://diamondsbycs.com/images/uploads/upload-658abdf793136.JPG'
    },
    {
      name: 'STEFANY ARMBAND',
      price: '1.850 €',
      category: '',
      image: 'https://diamondsbycs.com/images/uploads/upload-666806716daf3.jpg'
    },
    {
      name: 'CHARLOTTE RING',
      price: 'Vanaf 790 €',
      category: '',
      image: 'https://diamondsbycs.com/images/uploads/upload-66680671732bc.jpg'
    },
    {
      name: 'CINDY RING',
      price: 'Vanaf 750 €',
      category: '',
      image: 'https://diamondsbycs.com/images/uploads/upload-666806717544c.jpg'
    },
    {
      name: 'SHARON KETTING',
      price: 'Vanaf 490 €',
      category: 'Tijdloos',
      image: 'https://diamondsbycs.com/images/uploads/upload-6668067177477.jpg'
    },
    {
      name: 'THE MORSE CODE RING',
      price: '450 €',
      category: 'Budgetvriendelijk',
      image: 'https://diamondsbycs.com/images/uploads/upload-6668067178e86.jpg'
    }
  ];

  return (
    <div>
      <Header />
      {/* Hero Section */}
      <section className="py-20 sm:py-32 lg:py-40 xl:py-48 bg-gradient-to-br from-[#e5d9d2] to-[#b4a5a0]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-4">
              <Gift className="h-8 w-8 text-[#764e3e] mr-3" />
              <div className="typography-h2 text-[#2c2827]">
                Gift <span className="font-bold text-[#764e3e]">inspiration</span>
              </div>
            </div>
            <div className="typography-body-xl text-[#837f7a] max-w-3xl mx-auto mb-8">
              Ontdek onze unieke selectie van prachtige juwelen, ideaal voor elke gelegenheid en ontvanger. Of u nu zoekt naar iets klassieks, moderns, of een persoonlijk gegraveerd stuk, hier vindt u volop inspiratie. Laat u betoveren door onze schitterende collecties en vind het perfecte sieraad om uw dierbaren mee te verrassen.
            </div>
            <div className="typography-body text-[#764e3e] font-semibold">Prijzen vanaf € 350*.</div>
          </div>
        </div>
      </section>

      {/* Perfect Gift Section */}
      <section className="py-20 sm:py-32 lg:py-40 xl:py-48 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[#2c2827] mb-8">
              Op zoek naar het perfecte cadeau?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {giftItems.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {item.category && (
                    <div className="absolute top-4 left-4 bg-[#764e3e] text-white px-3 py-1 text-sm font-medium rounded">
                      {item.category}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#2c2827] mb-2">
                    {item.name}
                  </h3>
                  <p className="text-[#764e3e] font-bold text-lg mb-4">
                    {item.price}
                  </p>
                  <button className="w-full bg-[#764e3e] hover:bg-[#906f53] text-white py-2 px-4 font-medium transition-colors duration-200 flex items-center justify-center">
                    <Gift className="mr-2 h-4 w-4" />
                    Bekijk Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Voucher Section */}
      <section className="py-20 sm:py-32 lg:py-40 xl:py-48 bg-[#e5d9d2]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12">
          <div className="bg-white shadow-lg p-8 text-center rounded-lg">
            <div className="flex items-center justify-center mb-6">
              <Star className="h-8 w-8 text-[#764e3e] mr-3" />
              <h2 className="text-3xl font-semibold text-[#2c2827]">Discover our giftvoucher</h2>
            </div>
            <p className="text-xl text-[#837f7a] mb-8 max-w-2xl mx-auto">
              The perfect gift for an exclusive custom made jewel.
            </p>
            <button className="bg-[#764e3e] hover:bg-[#906f53] text-white px-8 py-4 font-medium transition-colors duration-200">
              Koop Gift Voucher
            </button>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 sm:py-32 lg:py-40 xl:py-48 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[#2c2827] mb-4">
              Wilt u graag bestellen en/of wenst u meer informatie?
            </h2>
            <p className="text-xl text-[#764e3e] font-medium">Stuur een bericht</p>
          </div>

          <div className="bg-[#e5d9d2] p-8 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2c2827] mb-2">
                    Je voornaam
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#837f7a] rounded focus:ring-2 focus:ring-[#764e3e] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2c2827] mb-2">
                    Je achternaam
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#837f7a] rounded focus:ring-2 focus:ring-[#764e3e] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2c2827] mb-2">
                    Je email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#837f7a] rounded focus:ring-2 focus:ring-[#764e3e] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2c2827] mb-2">
                    Je telefoonnummer
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#837f7a] rounded focus:ring-2 focus:ring-[#764e3e] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2c2827] mb-2">
                  Typ hier je bericht
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-[#837f7a] rounded focus:ring-2 focus:ring-[#764e3e] focus:border-transparent resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2c2827] mb-2">
                  Heb je al wat inspiratie voor mij? stuur gerust een foto door.
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="inspiration-photo"
                  />
                  <label
                    htmlFor="inspiration-photo"
                    className="bg-[#764e3e] hover:bg-[#906f53] text-white px-6 py-3 rounded cursor-pointer flex items-center transition-colors duration-200"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </label>
                  <span className="text-[#837f7a] text-sm">No file chosen</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#764e3e] hover:bg-[#906f53] text-white py-4 px-6 font-medium rounded transition-colors duration-200 flex items-center justify-center"
              >
                Verstuur Bericht
                <Send className="ml-2 h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};