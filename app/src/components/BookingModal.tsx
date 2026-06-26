"use client";

import { useState } from "react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
  preselectedAddons?: string[];
}

const mainServices = [
  { value: "Ikigai Discovery Session (Free)", price: 0 },
  { value: "Ikigai Alignment Journey ($555)", price: 555 },
  { value: "Ikigai Transformation Path ($1,000)", price: 1000 },
  { value: "Ikigai Intensive VIP Day ($400)", price: 400 },
  { value: "Keynote Speaking (From $555)", price: 555 },
  { value: "Corporate Masterclass (From $600)", price: 600 },
  { value: "Executive Retreat (Custom)", price: -1 },
];

const addonOptions = [
  { value: "Ikigai Toolkit PDF ($75)", label: "Ikigai Toolkit PDF", price: 75 },
  { value: "Email Check-In Add-On ($50)", label: "Weekly Email Check-In", price: 50 },
  { value: "Group Circle Pass ($100)", label: "Group Circle Pass", price: 100 },
];

const priceMap: Record<string, number> = {};
for (const s of mainServices) priceMap[s.value] = s.price;
for (const a of addonOptions) priceMap[a.value] = a.price;

export default function BookingModal({
  isOpen,
  onClose,
  preselectedService = "",
  preselectedAddons = [],
}: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [service, setService] = useState(preselectedService);
  const [addons, setAddons] = useState<string[]>(preselectedAddons);
  const [payment, setPayment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    type: "percent" | "fixed";
    value: number;
    label: string;
  } | null>(null);
  const [discountError, setDiscountError] = useState("");

  const discountCodes: Record<string, { type: "percent" | "fixed"; value: number; label: string }> = {
    IKIGAI10: { type: "percent", value: 10, label: "10% off" },
    WELCOME20: { type: "fixed", value: 20, label: "$20 off" },
  };

  const applyDiscount = () => {
    const code = discountCodes[discountInput.toUpperCase()];
    if (code) {
      setAppliedDiscount(code);
      setDiscountError("");
    } else {
      setAppliedDiscount(null);
      setDiscountError("Invalid discount code");
    }
  };

  if (!isOpen) return null;

  const toggleAddon = (value: string) => {
    setAddons((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const mainPrice = service ? priceMap[service] ?? 0 : 0;
  const addonsTotal = addons.reduce((sum, a) => sum + (priceMap[a] ?? 0), 0);
  const subtotal = mainPrice + addonsTotal;
  const discountAmount = appliedDiscount
    ? appliedDiscount.type === "percent"
      ? Math.round(subtotal * (appliedDiscount.value / 100))
      : appliedDiscount.value
    : 0;
  const total = Math.max(0, subtotal - discountAmount);
  const deposit = Math.round(total * 0.5);

  const reset = () => {
    setStep(1);
    setService(preselectedService);
    setAddons(preselectedAddons);
    setPayment("");
    setSubmitted(false);
    setDiscountInput("");
    setAppliedDiscount(null);
    setDiscountError("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(30,18,8,0.6)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={() => { reset(); onClose(); }}
          className="absolute top-4 right-4 text-text-muted hover:text-text-dark text-2xl leading-none p-1"
          aria-label="Close"
        >
          &times;
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🌸</div>
            <h3 className="font-display text-xl font-semibold text-pine mb-2">
              Booking Confirmed!
            </h3>
            <p className="text-sm text-text-mid mb-6">
              Your session request has been received. Here&rsquo;s what happens next:
            </p>
            <div className="text-left space-y-3 bg-soft-white rounded-xl p-5 mb-6">
              {service && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Package</span>
                  <span className="font-medium text-text-dark">{service}</span>
                </div>
              )}
              {addons.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Add-Ons</span>
                  <span className="font-medium text-text-dark">{addons.join(", ")}</span>
                </div>
              )}
              {appliedDiscount && (
                <div className="flex justify-between text-sm text-pine">
                  <span>Discount ({appliedDiscount.label})</span>
                  <span className="font-medium">-${discountAmount}</span>
                </div>
              )}
              {subtotal > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-medium text-text-dark">${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold pt-1 border-t border-black/8">
                    <span className="text-text-dark">Total due</span>
                    <span className="text-text-dark">${total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Due now (50% deposit)</span>
                    <span className="font-medium text-text-dark">${deposit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Due later</span>
                    <span className="font-medium text-text-dark">${total - deposit}</span>
                  </div>
                </>
              )}
              {payment && (
                <div className="pt-3 border-t border-black/8">
                  <p className="text-sm text-text-muted mb-1">Payment method</p>
                  <p className="font-medium text-sm text-text-dark">
                    {payment === "paypal" && "PayPal"}
                    {payment === "mpesa" && "M-Pesa"}
                    {payment === "bank" && "Bank Transfer"}
                  </p>
                  <p className="text-sm text-text-muted mt-1">
                    {payment === "paypal" && "Send to umulkheiri@yahoo.com. A payment invoice link will be sent to your email."}
                    {payment === "mpesa" && "Paybill: 247247, Account: IKIGAI-[Your Name]. Confirmation SMS will be sent."}
                    {payment === "bank" && "Account details will be sent to your email within 1 hour."}
                  </p>
                </div>
              )}
              <p className="text-sm text-text-muted pt-2">
                A confirmation email with next steps and your session prep guide will arrive within 24 hours. I&rsquo;ll reach out to schedule your first session.
              </p>
            </div>
            <button
              onClick={() => { reset(); onClose(); }}
              className="px-6 py-3 rounded-lg bg-espresso text-white text-sm font-medium hover:bg-cinnamon transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Steps indicator */}
            <div className="flex items-center gap-2 text-sm font-medium">
              {["Choose", "Details", "Pay"].map((label, i) => {
                const idx = i + 1;
                return (
                  <div key={label} className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${
                        step === idx
                          ? "bg-saffron text-white"
                          : step > idx
                          ? "bg-garden-teal text-white"
                          : "bg-black/6 text-text-muted"
                      }`}
                    >
                      {step > idx ? "✓" : idx}
                    </span>
                    <span className={step === idx ? "text-text-dark" : "text-text-muted"}>{label}</span>
                    {i < 2 && <span className="text-black/10 ml-1">──</span>}
                  </div>
                );
              })}
            </div>

            {/* Step 1: Choose */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-text-dark">Choose your package</h3>
                  <p className="text-sm text-text-muted">Select a coaching package and any add-ons.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">Package</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-black/12 text-sm outline-none focus:border-saffron transition-colors bg-soft-white text-text-dark"
                  >
                    <option value="">Select a package...</option>
                    {mainServices.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Add-Ons <span className="text-text-muted font-normal">(optional)</span>
                  </label>
                  <div className="space-y-2">
                    {addonOptions.map((addon) => (
                      <label
                        key={addon.value}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg border border-black/8 hover:border-saffron/30 transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={addons.includes(addon.value)}
                          onChange={() => toggleAddon(addon.value)}
                          className="accent-saffron w-4 h-4"
                        />
                        <span className="text-sm text-text-dark flex-1">{addon.label}</span>
                        <span className="text-sm text-text-muted">+${addon.price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {service && (
                  <div className="bg-soft-white rounded-xl p-4 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Package</span>
                      <span className="text-text-dark">{service}</span>
                    </div>
                    {addons.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">Add-Ons</span>
                        <span className="text-text-dark">+${addonsTotal}</span>
                      </div>
                    )}
                    {appliedDiscount && (
                      <div className="flex justify-between text-pine">
                        <span>Discount ({appliedDiscount.label})</span>
                        <span>-${discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold pt-1 border-t border-black/8 mt-1">
                      <span className="text-text-dark">Total</span>
                      <span className="text-text-dark">${total}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setStep(2)}
                  disabled={!service}
                  className="w-full py-3 rounded-lg bg-saffron text-white font-medium text-sm hover:bg-cinnamon transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-text-dark">Your details</h3>
                  <p className="text-sm text-text-muted">How can I reach you?</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1.5">
                      Full Name <span className="text-saffron">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-black/12 text-sm outline-none focus:border-saffron transition-colors bg-soft-white"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1.5">
                      Email <span className="text-saffron">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-black/12 text-sm outline-none focus:border-saffron transition-colors bg-soft-white"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Phone <span className="text-text-muted font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg border border-black/12 text-sm outline-none focus:border-saffron transition-colors bg-soft-white"
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Message <span className="text-text-muted font-normal">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-black/12 text-sm outline-none focus:border-saffron transition-colors bg-soft-white resize-y"
                    placeholder="Anything you'd like me to know before we begin..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-lg border border-black/12 text-text-dark text-sm font-medium hover:bg-black/4 transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-[2] py-3 rounded-lg bg-saffron text-white font-medium text-sm hover:bg-cinnamon transition-colors cursor-pointer"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-text-dark">Payment & confirm</h3>
                  <p className="text-sm text-text-muted">Choose how you&rsquo;d like to pay. A 50% deposit secures your spot.</p>
                </div>

                <div className="bg-soft-white rounded-xl p-4 space-y-1 text-sm">
                  {service && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">Package</span>
                      <span className="text-text-dark">{service}</span>
                    </div>
                  )}
                  {addons.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">Add-Ons</span>
                      <span className="text-text-dark">+${addonsTotal}</span>
                    </div>
                  )}
                  {appliedDiscount && (
                    <div className="flex justify-between text-pine">
                      <span>Discount ({appliedDiscount.label})</span>
                      <span>-${discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold pt-1 border-t border-black/8 mt-1">
                    <span className="text-text-dark">Total</span>
                    <span className="text-text-dark">${total}</span>
                  </div>
                  {total > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Deposit due now (50%)</span>
                        <span className="font-medium text-saffron">${deposit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Balance due later</span>
                        <span className="text-text-dark">${total - deposit}</span>
                      </div>
                    </>
                  )}
                  {total === 0 && !appliedDiscount && (
                    <p className="text-sm text-text-muted text-center py-2">Free session — no payment needed.</p>
                  )}
                  {total === 0 && appliedDiscount && (
                    <p className="text-sm text-pine text-center py-2">Discount applied — your session is now free!</p>
                  )}
                </div>

                {/* Discount code */}
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">
                    Discount code <span className="text-text-muted font-normal">(optional)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountInput}
                      onChange={(e) => {
                        setDiscountInput(e.target.value);
                        setDiscountError("");
                      }}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-3 rounded-lg border border-black/12 text-sm outline-none focus:border-saffron transition-colors bg-soft-white uppercase"
                    />
                    <button
                      type="button"
                      onClick={applyDiscount}
                      className="px-5 py-3 rounded-lg border border-saffron text-saffron text-sm font-medium hover:bg-saffron-tint transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {discountError && (
                    <p className="text-sm text-cinnamon mt-1">{discountError}</p>
                  )}
                  {appliedDiscount && (
                    <p className="text-sm text-pine mt-1">{appliedDiscount.label} applied!</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Payment method
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "paypal", label: "PayPal", desc: "Pay with card or PayPal account" },
                      { value: "mpesa", label: "M-Pesa", desc: "Lipa na M-Pesa (Kenya)" },
                      { value: "bank", label: "Bank Transfer", desc: "Direct bank deposit" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors cursor-pointer ${
                          payment === opt.value
                            ? "border-saffron bg-saffron-tint"
                            : "border-black/8 hover:border-saffron/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={opt.value}
                          checked={payment === opt.value}
                          onChange={(e) => setPayment(e.target.value)}
                          className="accent-saffron"
                        />
                        <div>
                          <span className="text-sm font-medium text-text-dark">{opt.label}</span>
                          <span className="text-sm text-text-muted block">{opt.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 rounded-lg border border-black/12 text-text-dark text-sm font-medium hover:bg-black/4 transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setSubmitted(true)}
                    disabled={!payment && total > 0}
                    className="flex-[2] py-3 rounded-lg bg-espresso text-white font-medium text-sm hover:bg-cinnamon transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {total > 0 ? `Confirm Booking — $${deposit} deposit` : "Confirm Free Session"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
