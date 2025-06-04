import additems from "../assets/additems.png";
import getorders from "../assets/getorders.png";
import register from "../assets/register.png";

interface Step {
  image: string;
  title: string;
  alt: string;
}

const steps: Step[] = [
  {
    image: register,
    alt: "Set up your digital menu",
    title: "Set up your digital menu",
  },
  {
    image: additems,
    alt: "Place QR codes on tables",
    title: "Place QR codes on tables",
  },
  {
    image: getorders,
    alt: "Customers order & pay via smartphone",
    title: "Customers order & pay via smartphone",
  },
];

export const HowItWorks: React.FC = () => (
  <section className="bg-gray-50 py-16">
    <div className="container mx-auto px-6">
      <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {steps.map(({ image, alt, title }, idx) => (
          <div key={idx} className="text-center">
            <img
              src={image}
              alt={alt}
              loading="lazy"
              className="mx-auto mb-4 h-150 w-150 object-contain rounded"
            />
            <h3 className="font-semibold">{title}</h3>
          </div>
        ))}
      </div>
    </div>
  </section>
);
