import { MdFileUpload, MdSecurity, MdSpeed } from "react-icons/md";
import { motion } from "framer-motion";

const Feature = () => {
    const featureVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };
    return (
        <section className="py-20 px-6 bg-gray-50 text-gray-800 z-0">
            <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[{
                icon: MdFileUpload,
                title: "Easy Uploads",
                desc: "Split and upload large files in secure chunks, resumable for convenience.",
                color: "from-blue-400 to-blue-600"
            },{
                icon: MdSecurity,
                title: "Encrypted & Safe",
                desc: "Files are encrypted with AES-GCM ensuring maximum security.",
                color: "from-green-400 to-green-600"
            },{
                icon: MdSpeed,
                title: "Fast & Reliable",
                desc: "Optimized speed with chunked uploads and cloud storage integration.",
                color: "from-purple-400 to-purple-600"
            }].map((feature, i) => (
                <motion.div
                key={feature.title}
                className={`bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center hover:shadow-2xl transition transform hover:-translate-y-2`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={featureVariants}
                transition={{ delay: i * 0.2 }}
                >
                <feature.icon size={48} className={`mb-4 text-gradient bg-gradient-to-br ${feature.color} text-transparent bg-clip-text`} />
                <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                <p>{feature.desc}</p>
                </motion.div>
            ))}
            </div>
        </section>
    )
}

export default Feature
