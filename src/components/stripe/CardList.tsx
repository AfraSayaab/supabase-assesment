"use client";
import { useState, useEffect } from "react";

const CardList = ({ userId }: { userId: any }) => {
    const [cards, setCards] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/payment/list-cards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
        })
            .then((res) => res.json())
            .then((data) => setCards(data.paymentMethods || []));
    }, [userId]);

    const removeCard = async (paymentMethodId: string) => {
        await fetch("/api/payment/remove-card", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentMethodId }),
        });

        setCards(cards.filter((card) => card.id !== paymentMethodId));
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-300">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Saved Cards</h2>

            {cards.length > 0 ? (
                <div className="space-y-4">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            className="flex justify-between items-center p-4 border border-gray-300 rounded-md bg-gray-50 shadow-sm"
                        >
                            <p className="text-lg font-medium text-gray-700">
                                **** **** **** {card.card.last4}{" "}
                                <span className="text-gray-500 text-sm">
                                    ({card.card.brand.toUpperCase()})
                                </span>
                            </p>
                            <button
                                onClick={() => removeCard(card.id)}
                                className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No saved cards available.</p>
            )}
        </div>
    );
};

export default CardList;
