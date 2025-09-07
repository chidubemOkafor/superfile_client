import { motion } from "framer-motion";
import chunksImage from "../../assets/chunksImage.png"
import createChannel from "../../assets/createChannel.png"

const HowItWorks = () => {
  const steps = [
    {
      title: "1. Create a channel",
      description:
        "After authenticating create a private telegram channel where you will be able to store your files.",
      image: createChannel,
      reverse: false,
    },
    {
      title: "2. Secure with Encryption",
      description:
        "Every file is encrypted with AES-GCM before leaving your device. Only you can access and manage your data safely.",
      image: "/assets/how-encrypt.png",
      reverse: true,
    },
    {
      title: "3. Manage & Access Anytime",
      description:
        "Easily manage your uploads, share securely, and retrieve files instantly — all powered by Telegram’s robust infrastructure.",
      image: "/assets/how-manage.png",
      reverse: false,
    },
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
        How It Works
      </h2>

      <div className="space-y-24 max-w-6xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className={`flex flex-col md:flex-row items-center gap-12 ${
              step.reverse ? "md:flex-row-reverse" : ""
            }`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.2 }}
          >
            {/* Image */}
            <div className="md:w-1/2">
              <img
                src={step.image}
                alt={step.title}
                className="w-full rounded-xl shadow-xl"
              />
            </div>

            {/* Text */}
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
