const data = [
    {
      icon: <></>,              // <-- valid JSX expression
      title: "Increase table turnover",
      desc: "Serve more guests faster with instant ordering.",
    },
    {
      icon: <></>,
      title: "Reduce staff workload",
      desc: "Let guests order on their own device—no extra trips.",
    },
    {
      icon: <></>,
      title: "Enhance customer experience",
      desc: "Sleek, safe and seamless ordering for every guest.",
    },
  ];
  
  
  export const Benefits: React.FC = () => (
    <section className="container mx-auto px-6 py-16">
      <h2 className="text-2xl font-bold text-center mb-12">Why QRMenu?</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {data.map(({ icon, title, desc }) => (
          <div key={title} className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 text-blue-600">{icon}</div>
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
  