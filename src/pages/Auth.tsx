import React, { useState } from "react";
import { MdOutlinePhone, MdOutlinePassword } from "react-icons/md";
import { LuScanBarcode } from "react-icons/lu";
import { FaLock } from "react-icons/fa";

const Auth = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Call API to send verification code here
    setStep(2);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Verify code API
    setStep(3);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Set password API
    alert("Authentication complete!");
  };

  const labelObj = [  
        {
            name: "Phone",
            icon: <MdOutlinePhone className="size-8 text-gray-700"/>
        },
        {
            name: "Code",
            icon: <LuScanBarcode className="size-8 text-gray-700"/>
        },
        {
            name: "Password",
            icon: <MdOutlinePassword className="size-8 text-gray-400"/>
        },
    ]

  const stepPercent = ((step - 1) / 2) * 100;

  const button = "w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 sm:py-5 px-8 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center space-x-3 text-sm sm:text-base"
  const input = "w-full p-4 border border-gray-100 rounded-xl outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-purple-400 transition"

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Telegram Auth
        </h1>

        {/* Step Progress */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 h-2 transition-all duration-500 rounded-md"
            style={{ width: `${stepPercent}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-8">
          {labelObj.map((label, idx) => (
            <div className="relative">
                {label.name === "Password" && <FaLock className="absolute right-0 text-red-500"/>}
            
                <div key={idx} className="flex flex-col items-center">
                    {label.icon}
                    <span className={`text-xs ${label.name === "Password" ? "text-gray-400" : "text-gray-600"}`}>{label.name}</span>
                </div>
            </div>
          ))}
        </div>

        {/* Forms */}
        {step === 1 && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <input
              type="tel"
              placeholder="Phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={input}
              required
            />
            <button
              type="submit"
              className={button}
            >
              Send Code
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={input}
              required
            />
            <button
              type="submit"
              className={button}
            >
              Verify Code
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Set Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={input}
              required
            />
            <button
              type="submit"
              className={button}
            >
              Complete
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
