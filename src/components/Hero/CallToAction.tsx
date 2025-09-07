import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="relative py-24 px-6 text-center overflow-hidden bg-[#0f172a] text-white">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Noise texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] opacity-20"></div>
        {/* Gradient spotlight */}
        <div className="absolute top-1/2 left-1/2 w-[120%] h-[120%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.4),transparent_70%)]"></div>
      </div>

      {/* CTA Content */}
      <motion.h2
        className="relative text-4xl md:text-5xl font-bold mb-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Ready to Secure Your Files?
      </motion.h2>

      <motion.p
        className="relative text-lg md:text-xl mb-10 text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        Sign up and start managing your files confidently today.
      </motion.p>

      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Link
          to="/process-file"
          className="px-10 py-4 bg-indigo-500 hover:bg-indigo-600 font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/40 transition"
        >
          Start Uploading
        </Link>
      </motion.div>
    </section>
  );
};

export default CallToAction;
