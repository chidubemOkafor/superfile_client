import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import dashboardImage from "../../assets/dashboard2.png";

const Hero = () => {
  return (
    <section className="relative text-white py-36 px-6 text-center overflow-hidden bg-[#0f172a]"> 
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 w-[120%] h-[120%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.5),transparent_70%)]"></div>
      </div>

      <motion.h1
        className="relative text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Secure & Lightning-Fast File Management
      </motion.h1>

      <motion.p
        className="relative text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        Connect to Telegram and Upload, encrypt, and manage your files seamlessly.  
        Your data is always safe, accessible, and fast.
      </motion.p>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Link
          to="/process-file"
          className="px-10 py-4 bg-indigo-500 hover:bg-indigo-600 font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/40 transition"
        >
          Get Started
        </Link>
      </motion.div>

      {/* Floating dashboard image */}
      <div className="relative mt-[5em] z-20 flex justify-center">
        <div className="w-[90%] md:w-3/4 lg:w-2/3 shadow-2xl rounded-xl overflow-hidden border border-white/10">
          <img
            src={dashboardImage}
            alt="Dashboard Preview"
            className="w-full h-auto rounded-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
