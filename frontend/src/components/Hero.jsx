
function Hero() {
    return (
        <section>
        
<div className="hero-section">

    <div className="flex wrapper">

        <div className="content">

            <h1>
                <span>Food</span> is an important part
                of a balanced diet
            </h1>

            <p className="para">
                We will fill your tummy with delicious food
                with fast delivery and best quality.
            </p>

            <div className="flex gap-2">

                <a href="/menu" className="btn">
                    Order now
                </a>

                <a href="#" className="social-icons">
                    <i className="fa-brands fa-twitter"></i>
                </a>

                <a href="#" className="social-icons">
                    <i className="fa-brands fa-instagram"></i>
                </a>

                <a href="#" className="social-icons">
                    <i className="fa-brands fa-facebook"></i>
                </a>

                <a href="#" className="social-icons">
                    <i className="fa-brands fa-google-plus-g"></i>
                </a>

            </div>

        </div>

        <div className="image-container">
            <img
                src="/images/delivery-boy.png"
                alt="Food delivery"
            />
        </div>

    </div>

</div>


        </section>
    );
}

export default Hero;

