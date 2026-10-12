"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

//form list
export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    message: "",
    agree: false,
  });
  //belangrijk

  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // TypeScript-safe handleChange
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target = e.target;

    let value: string | boolean;

    if (target instanceof HTMLInputElement) {
      value = target.type === "checkbox" ? target.checked : target.value;
    } else {
      value = target.value;
    }

    setFormData((prev) => ({
      ...prev,
      [target.name]: value,
    }));
  };

  // handleSubmit met fetch POST
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // voorkomt GET
    setStatus(null);

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.message
    ) {
      setStatus({
        type: "error",
        text: "Vul alstublieft alle verplichte velden in.",
      });
      return;
    }

    if (!formData.agree) {
      setStatus({
        type: "error",
        text: "U moet akkoord gaan met ons privacybeleid.",
      });
      return;
    }

    setLoading(true);

    //fetches api and uses method post
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          agree: formData.agree,
        }),
      });

      const json = await res.json();

      //checks if everything is send.
      if (res.ok) {
        setStatus({ type: "success", text: "Bericht succesvol verzonden!" });
        setFormData({
          firstName: "",
          lastName: "",
          company: "",
          email: "",
          phone: "",
          message: "",
          agree: false,
        });
      } else {
        setStatus({
          type: "error",
          text: json?.error || "Er ging iets mis. Probeer opnieuw.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        text: "Kon geen verbinding maken. Probeer opnieuw.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      {/*header */}
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          Contact pagina
        </h2>
        <p className="mt-2 text-lg/8 text-gray-600">Neem contact op met ons!</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-semibold text-gray-900"
            >
              Voornaam
            </label>
            <input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-2.5 block w-full rounded-md border border-gray-300 px-3.5 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-semibold text-gray-900"
            >
              Achternaam
            </label>
            <input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-2.5 block w-full rounded-md border border-gray-300 px-3.5 py-2"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="company"
              className="block text-sm font-semibold text-gray-900"
            >
              Bedrijf{" "}
            </label>
            <input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="mt-2.5 block w-full rounded-md border border-gray-300 px-3.5 py-2"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-900"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2.5 block w-full rounded-md border border-gray-300 px-3.5 py-2"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-900"
            >
              Telefoon
            </label>
            <div className="mt-2.5 flex rounded-md border border-gray-300">
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                placeholder="123-456-7890"
                className="block w-full border-none px-2 py-1"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-gray-900"
            >
              Bericht
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="mt-2.5 block w-full rounded-md border border-gray-300 px-3.5 py-2"
            />
          </div>

          <div className="flex gap-x-4 sm:col-span-2">
            <input
              id="agree"
              name="agree"
              type="checkbox"
              checked={formData.agree}
              onChange={handleChange}
              className="h-6 w-6 rounded border-gray-300"
            />
            <label htmlFor="agree" className="text-sm text-gray-600">
              Door dit aan te vinken, gaat u akkoord met ons{" "}
              <Link
                href="https://www.sdgnederland.nl/privacy-statement/"
                className="font-semibold text-yellow-400"
              >
                privacybeleid
              </Link>
              .
            </label>
          </div>
        </div>

        {status && (
          <p
            className={`mt-4 text-sm ${status.type === "success" ? "text-green-500" : "text-red-500"}`}
          >
            {status.text}
          </p>
        )}

        <div className="mt-10">
          <button
            type="submit"
            disabled={loading}
            className="block w-full rounded-md bg-green-700 px-3.5 py-2.5 text-center text-sm font-semibold text-white hover:bg-yellow-400"
          >
            {loading ? "Verzenden..." : "Verzenden"}
          </button>
        </div>
      </form>
      
      <div className="mx-auto mt-24 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2455.091163271821!2d4.3499140999999995!3d52.0234369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5b5d771b631e7%3A0xcbe808e083d3d558!2sROC%20Mondriaan!5e0!3m2!1sen!2snl!4v1769735423819!5m2!1sen!2snl"
              className="w-full h-80 border-0"
              loading="lazy"
            />
          </div>

          <div className="rounded-xl border p-6 shadow-lg bg-white">
            <h3 className="text-xl font-semibold text-gray-900">
              Onze locatie
            </h3>
            <p className="mt-2 text-gray-600">Wij zijn gevestigd in Delft.</p>
            <p className="mt-4 text-gray-700">
              Gemeente: Delft, Nederland
              <br />
              Email: info@rocmondriaan.nl
              <br />
              telefoonnummer: +0886663635
              <br />
              Website: https://www.rocmondriaan.nl/
              <br /> Ma-Vr: 08:00 - 17:00
              <br /> Za-Zo: Gesloten
            </p>
          </div>
        </div>
      </div>
    </div>
    
  );
}
