"use client";
import React, { useState } from "react";
import CreateOffer from "@/app/wishOffer/offer/create-offer/page";
import EventForm from "@/app/wishOffer/wishes/create-wish/page";

const ParticipateSection = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null); // Track which form to display

  const handleParticipateClick = () => {
    setIsPopupOpen(true);
    setActiveForm(null); // Reset to the main modal
  };

  const handleClose = () => {
    setIsPopupOpen(false);
    setActiveForm(null);
  };

  const handleFormOpen = (formType) => {
    setActiveForm(formType); // Set active form ('wish' or 'offer')
  };

  return (
    <div>
      {/* Participate Now Button */}
      <button
        onClick={handleParticipateClick}
        className="bg-purple-600 text-white py-3 px-6 mr-7 rounded-lg hover:bg-purple-700"
      >
        Participate Now →
      </button>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative overflow-auto max-h-[90vh]">
            {activeForm === null && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Choose Your Participation
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                  Would you like to participate with a <strong>Wish</strong> or
                  an <strong>Offer</strong>?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => handleFormOpen("wish")}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                  >
                    Wish
                  </button>
                  <button
                    onClick={() => handleFormOpen("offer")}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                  >
                    Offer
                  </button>
                </div>
                <div className="text-center mt-4">
                  <button
                    onClick={handleClose}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
            {activeForm === "wish" && (
              <div>
                <EventForm /> {/* Render the CreateWish form */}
                <div className="text-center mt-4">
                  <button
                    onClick={handleClose}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            {activeForm === "offer" && (
              <div>
                <CreateOffer />
                <div className="text-center mt-4">
                  <button
                    onClick={handleClose}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Close Icon */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-400"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipateSection;
