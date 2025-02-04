"use client";
import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const AddCard = ({ userId }: { userId: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    // Create Payment Method
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setMessage(error.message || "Card error");
      setLoading(false);
      return;
    }

    // Send paymentMethod.id to backend
    const response = await fetch("/api/payment/add-card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentMethodId: paymentMethod.id,
        userId,
      }),
    });

    const data = await response.json();
    if (data.error) setMessage(data.error);
    else setMessage("Card added successfully!");

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-300"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Payment Card</h2>

      <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
        <CardElement
          className="p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full mt-4 bg-black text-white py-3 rounded-md font-medium hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Add Card"}
      </button>

      {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
    </form>
  );
};

export default AddCard;
