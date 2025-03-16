"use client";

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() !== '') {
      // In a real implementation, this would call an API to subscribe the user
      console.log('Subscribing email:', email);
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 bg-gold-dark text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-playfair mb-4">Join Our Newsletter</h2>
          <p className="mb-8 text-gold-light/80">
            Subscribe to receive updates on new collections, exclusive offers, and jewelry care tips.
          </p>

          {subscribed ? (
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-medium mb-2">Thank You for Subscribing!</h3>
              <p>You've been added to our mailing list and will be among the first to know about our new arrivals, special offers, and more.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 flex-grow md:max-w-md"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-white text-gold-dark font-medium hover:bg-white/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="mt-4 text-sm text-gold-light/70">
            By subscribing, you agree to our privacy policy and consent to receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  );
}
