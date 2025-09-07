
import Navbar from "../components/Navbar";
import Feature from "../components/Hero/Feature";
import Hero from "../components/Hero/Hero";
import CallToAction from "../components/Hero/CallToAction";
import HowItWorks from "../components/Hero/HowItWorks";

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar/>
            <Hero/>
            <HowItWorks/>
            <Feature/>
            <CallToAction/>
        </div>
    );
};

export default Home;
