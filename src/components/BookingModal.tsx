import React, { useState } from 'react';
import { Restaurant } from '../types';

interface BookingModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ restaurant, isOpen, onClose }) => {
  const [partySize, setPartySize] = useState('2 people');
  const [date, setDate] = useState('Today, Oct 24');
  const [time, setTime] = useState('7:30 PM');
  const [specialRequest, setSpecialRequest] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !restaurant) return null;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-[#ffded4] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#523932] hover:text-[#ff4500] p-1.5 rounded-full hover:bg-[#fff0eb] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {isSuccess ? (
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-[#ff4500] to-[#ff8c00] text-white rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h3 className="font-garamond text-2xl font-bold text-[#1e110d] mb-2">
              Reservation Confirmed!
            </h3>
            <p className="font-grotesk text-sm text-[#523932]">
              Table for {partySize} at <strong className="text-[#ff4500]">{restaurant.name}</strong> on {date} at {time}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="flex flex-col gap-4">
            <div>
              <span className="text-xs font-grotesk font-bold text-[#ff4500] uppercase tracking-wider bg-[#fff0eb] px-2.5 py-0.5 rounded-full border border-[#ffcfc2]">
                Instant Table Reservation
              </span>
              <h2 className="font-garamond text-2xl font-bold text-[#1e110d] mt-2">
                {restaurant.name}
              </h2>
              <p className="font-grotesk text-xs text-[#523932]">
                {restaurant.neighborhood} • {restaurant.cuisine}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-grotesk font-bold text-[#1e110d] mb-1">
                  Party Size
                </label>
                <select
                  value={partySize}
                  onChange={(e) => setPartySize(e.target.value)}
                  className="w-full bg-[#fff5f0] border border-[#ffcfc2] rounded-xl px-3 py-2 text-xs font-grotesk font-semibold text-[#1e110d] outline-hidden focus:border-[#ff4500] cursor-pointer"
                >
                  <option value="1 person">1 person</option>
                  <option value="2 people">2 people</option>
                  <option value="3 people">3 people</option>
                  <option value="4 people">4 people</option>
                  <option value="6+ people">6+ people (Group)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-grotesk font-bold text-[#1e110d] mb-1">
                  Date
                </label>
                <select
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#fff5f0] border border-[#ffcfc2] rounded-xl px-3 py-2 text-xs font-grotesk font-semibold text-[#1e110d] outline-hidden focus:border-[#ff4500] cursor-pointer"
                >
                  <option value="Tonight">Tonight</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="This Friday">This Friday</option>
                  <option value="This Saturday">This Saturday</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-grotesk font-bold text-[#1e110d] mb-1">
                Preferred Time
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['6:30 PM', '7:00 PM', '7:30 PM', '8:15 PM'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    className={`py-2 rounded-xl text-xs font-grotesk font-bold border transition-all cursor-pointer shadow-2xs ${
                      time === t
                        ? 'bg-gradient-to-r from-[#ff4500] to-[#ff781f] text-white border-[#ff4500] shadow-sm'
                        : 'bg-[#fff5f0] text-[#523932] border-[#ffcfc2] hover:border-[#ff4500] hover:text-[#ff4500]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-grotesk font-bold text-[#1e110d] mb-1">
                Special Requests or Dietary Preferences (Optional)
              </label>
              <input
                type="text"
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="e.g. Quiet booth, anniversary, vegetarian"
                className="w-full bg-[#fff5f0] border border-[#ffcfc2] rounded-xl px-3 py-2 text-xs font-grotesk text-[#1e110d] outline-hidden focus:border-[#ff4500] placeholder:text-[#523932]/60"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#ff4500] via-[#e63900] to-[#ff781f] hover:from-[#e63900] hover:to-[#ff5e1a] text-white font-grotesk text-sm font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 mt-2 cursor-pointer"
            >
              Confirm Booking
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
