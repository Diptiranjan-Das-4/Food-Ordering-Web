import { useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import PopularFoods from "../components/PopularFoods";
import Footer from "../components/Footer";

function Home() {
const [selectedCategory, setSelectedCategory] =
useState("Popular");


return (
    <>
        <Navbar />

        <main>

            <Hero />

            <Categories
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            <PopularFoods
                selectedCategory={selectedCategory}
            />

        </main>

        <Footer />
    </>
);


}

export default Home;
