interface HeroProps {
    imageSrc?: string;
  }
  
  export const Hero: React.FC<HeroProps> = ({ imageSrc = "/assets/hero.jpg" }) => (
    <section className="bg-gray-50">
      <div className="container mx-auto px-6 py-16 flex flex-col-reverse md:flex-row items-center">
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold mb-4">
            Transform Your Restaurant with Contactless Ordering
          </h1>
          <p className="mb-6 text-gray-600">
            Let your guests browse menus, place orders and pay—all from their phones.
          </p>
          <button
            onClick={() => alert("Demo requested!")}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Request Demo
          </button>
        </div>
        <div className="md:w-1/2 mb-8 md:mb-0">
          <img src={imageSrc} alt="QR code in restaurant" className="w-full rounded-lg shadow-lg"/>
        </div>
      </div>
    </section>
  );
  