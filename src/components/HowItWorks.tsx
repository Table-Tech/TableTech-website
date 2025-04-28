const steps = [
    "Set up your digital menu",
    "Place QR codes on tables",
    "Customers order & pay via smartphone"
  ];
  
  export const HowItWorks: React.FC = () => (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 bg-blue-600 text-white rounded-full
                              flex items-center justify-center">
                {i + 1}
              </div>
              <h3 className="font-semibold">{step}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
  