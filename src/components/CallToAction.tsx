export const CallToAction: React.FC = () => (
    <section className="container mx-auto px-6 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Ready to digitize your dining experience?</h2>
      <button
        onClick={() => alert("Free trial started!")}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Start Your Free Trial
      </button>
    </section>
  );
  