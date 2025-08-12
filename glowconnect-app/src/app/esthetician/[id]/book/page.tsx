'use client';

import { useSearchParams, useParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function BookingForm() {
  const searchParams = useSearchParams();
  const params = useParams(); // Hook to get route parameters like [id]

  const serviceName = searchParams.get('service');
  const price = searchParams.get('price');
  const estheticianId = params.id as string;

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const formData = new FormData(event.currentTarget);
    const dateTime = formData.get('datetime');
    const notes = formData.get('notes');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estheticianId,
          serviceName,
          dateTime,
          notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create appointment');
      }

      setStatus('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setErrorMessage(message);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Booking Confirmed!</h1>
        <p className="text-gray-700">Your appointment for <strong>{serviceName}</strong> has been successfully requested.</p>
        <p className="text-gray-600 mt-2">You will receive a confirmation shortly.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Book Your Appointment</h1>
        <p className="text-gray-600 mb-6">Please select a date and time for your service.</p>

        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-800">{serviceName || 'Service not selected'}</h2>
          <p className="text-indigo-500 font-bold text-xl">€{price || '0'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="datetime" className="block text-gray-700 text-sm font-bold mb-2">
              Date and Time
            </label>
            <input
              type="datetime-local"
              id="datetime"
              name="datetime"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              disabled={status === 'submitting'}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">
              Optional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Any special requests or information?"
              disabled={status === 'submitting'}
            ></textarea>
          </div>

          {status === 'error' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-200 disabled:bg-indigo-300"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default function BookingPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <Suspense fallback={<div>Loading booking form...</div>}>
                <BookingForm />
            </Suspense>
        </div>
    )
}
