import React, { useEffect, useState } from "react";
import Hero from "../../components/student/Hero";
import Companies from "../../components/student/Companies";
import CoursesSection from "../../components/student/CoursesSection";
import TestimonialsSection from "../../components/student/TestimonialsSection";
import CallToAction from "../../components/student/CallToAction";
import Footer from "../../components/student/Footer";
import Loading from "../../components/student/Loading";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay (e.g., fetching data)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // 1.5 seconds

    return () => clearTimeout(timer); // cleanup if component unmounts early
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="w-full bg-[#E2FADB]">
      <Hero />
      <Companies />
      <CoursesSection />
      <TestimonialsSection />
      <CallToAction />
      <Footer />
    </main>
  );
};

export default Home;
