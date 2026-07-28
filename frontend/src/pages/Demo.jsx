import {
  ArrowRight,
  Play,
} from "lucide-react";


export default function Demo() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Background Glow */}

      <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-[140px]" />

      <div className="absolute top-72 -right-32 h-[28rem] w-[28rem] rounded-full bg-violet-600/20 blur-[160px]" />

      <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      {/* Hero */}

      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">

        <div className="rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-xl">

          <span className="text-sm text-slate-300">
            AI Powered Courier Automation
          </span>

        </div>

        <h1 className="mt-8 text-6xl font-extrabold leading-tight">

          Automate

          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">

            {" "}Delivery Sheets

          </span>

        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-400">

          Scan courier sheets using AI OCR, automatically calculate delivery
          charges, review shipments, autosave changes and export everything
          directly into Excel.

        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-5">

          <button className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-7 py-4 font-semibold transition hover:scale-105 hover:bg-indigo-500">

            <Play size={18} />

            Live Demo

          </button>

          <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 backdrop-blur-xl transition hover:bg-white/10">

            Learn More

            <ArrowRight size={18} />

          </button>

        </div>

      </section>
      {/* Workflow */}

<section className="relative z-10 mx-auto max-w-7xl px-6 pb-32">

  <div className="text-center">

    <p className="text-indigo-400 font-semibold uppercase tracking-widest">
      Workflow
    </p>

    <h2 className="mt-4 text-5xl font-bold">
      One Smooth Pipeline
    </h2>

    <p className="mt-5 text-slate-400 max-w-2xl mx-auto">
      Every delivery sheet follows the same streamlined journey—from
      image upload to Excel—while reducing manual work and errors.
    </p>

  </div>

  <div className="mt-20 grid gap-8 md:grid-cols-3">

    {[
      {
        emoji: "📷",
        title: "Upload Sheet",
        desc: "Take a photo or upload an existing delivery sheet.",
      },
      {
        emoji: "🤖",
        title: "AI OCR",
        desc: "Google Gemini extracts AWB, weight, pieces and shipment data.",
      },
      {
        emoji: "✏️",
        title: "Review",
        desc: "Edit any shipment before confirming the delivery sheet.",
      },
      {
        emoji: "💾",
        title: "Autosave",
        desc: "Every change is automatically saved to MongoDB.",
      },
      {
        emoji: "📊",
        title: "Excel Export",
        desc: "Confirmed shipments are ready for Microsoft Excel.",
      },
      {
        emoji: "📜",
        title: "Logs",
        desc: "Access previous uploads and completed delivery sheets anytime.",
      },
    ].map((step, index) => (

      <div
        key={index}
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:border-indigo-400/50 hover:bg-white/10"
      >

        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-indigo-500/10 blur-3xl transition group-hover:bg-indigo-500/20" />

        <div className="relative">

          <div className="text-5xl">
            {step.emoji}
          </div>

          <h3 className="mt-6 text-2xl font-semibold">
            {step.title}
          </h3>

          <p className="mt-4 leading-7 text-slate-400">
            {step.desc}
          </p>

        </div>

      </div>

    ))}

  </div>

</section>

{/* Product Preview */}

<section className="relative z-10 mx-auto max-w-7xl px-6 pb-36">

  <div className="text-center">

    <p className="font-semibold uppercase tracking-[0.3em] text-indigo-400">
      Product Preview
    </p>

    <h2 className="mt-4 text-5xl font-bold">
      Built for Speed.
      <br />
      Designed for Simplicity.
    </h2>

    <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
      A clean workspace where delivery sheets are scanned,
      verified, edited and exported with just a few clicks.
    </p>

  </div>

  <div className="relative mt-24 flex justify-center">

    {/* Glow */}

    <div className="absolute h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[140px]" />

    {/* Browser */}

    <div className="relative w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,.45)]">

      {/* Browser Header */}

      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">

        <div className="flex gap-2">

          <div className="h-3 w-3 rounded-full bg-red-400"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
          <div className="h-3 w-3 rounded-full bg-green-400"></div>

        </div>

        <div className="rounded-full bg-white/5 px-5 py-2 text-sm text-slate-400">

          delivery-automation.app

        </div>

        <div></div>

      </div>

      {/* App Preview */}

      <div className="grid gap-8 p-8 lg:grid-cols-3">

        {/* Sidebar */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

          <h3 className="mb-6 font-semibold text-slate-200">
            Dashboard
          </h3>

          {[
            "🏠 Home",
            "📦 Pending Uploads",
            "📊 Logs",
            "📁 Excel",
            "⚙ Settings",
          ].map((item) => (

            <div
              key={item}
              className="mb-3 rounded-xl bg-white/5 px-4 py-3 text-slate-300 transition hover:bg-indigo-500/20"
            >
              {item}
            </div>

          ))}

        </div>

        {/* Main */}

        <div className="lg:col-span-2">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

            <div className="mb-6 flex items-center justify-between">

              <h3 className="text-xl font-semibold">
                Delivery Sheet
              </h3>

              <div className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm text-emerald-300">

                ✓ Autosaved

              </div>

            </div>

            <div className="space-y-4">

              {[
                ["932847236", "2", "4.5kg", "₹10"],
                ["845721903", "1", "2kg", "₹5"],
                ["904728112", "3", "7kg", "₹15"],
                ["732194821", "4", "9kg", "₹20"],
              ].map((row, index) => (

                <div
                  key={index}
                  className="grid grid-cols-4 rounded-2xl bg-white/5 p-4 text-center text-slate-300"
                >

                  <div>{row[0]}</div>
                  <div>{row[1]}</div>
                  <div>{row[2]}</div>
                  <div>{row[3]}</div>

                </div>

              ))}

            </div>

            <div className="mt-8 flex justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Shipments
                </p>

                <h2 className="text-3xl font-bold">
                  24
                </h2>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Total Amount
                </p>

                <h2 className="text-3xl font-bold text-indigo-400">
                  ₹480
                </h2>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</section>

{/* Statistics */}

<section className="relative z-10 mx-auto max-w-7xl px-6 pb-32">

  <div className="grid gap-6 md:grid-cols-4">

    {[
      {
        number: "99%",
        title: "OCR Accuracy",
      },
      {
        number: "<2s",
        title: "Average Processing",
      },
      {
        number: "100%",
        title: "Autosave",
      },
      {
        number: "24/7",
        title: "Available",
      },
    ].map((item, index) => (

      <div
        key={index}
        className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-indigo-400/40"
      >

        <h3 className="text-5xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">

          {item.number}

        </h3>

        <p className="mt-4 text-slate-400">

          {item.title}

        </p>

      </div>

    ))}

  </div>

</section>

{/* Architecture */}

<section className="relative z-10 mx-auto max-w-6xl px-6 pb-36">

  <div className="text-center">

    <p className="font-semibold uppercase tracking-[0.3em] text-indigo-400">
      Architecture
    </p>

    <h2 className="mt-5 text-5xl font-bold">
      Built With a Modern Stack
    </h2>

    <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
      Every upload flows through a modern backend powered by AI,
      cloud storage and Microsoft services.
    </p>

  </div>

  <div className="relative mt-24">

    {/* Vertical Line */}

    <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-indigo-500 via-violet-500 to-cyan-500 md:block"></div>

    {[
      {
        icon: "⚛️",
        title: "React Frontend",
        desc: "Beautiful responsive interface built with React and Tailwind CSS.",
      },
      {
        icon: "🚀",
        title: "Express API",
        desc: "Handles OCR requests, uploads and shipment management.",
      },
      {
        icon: "🤖",
        title: "Google Gemini OCR",
        desc: "Extracts AWB numbers, pieces and weight automatically.",
      },
      {
        icon: "🗄️",
        title: "MongoDB Atlas",
        desc: "Stores uploads, shipment data and delivery history.",
      },
      {
        icon: "☁️",
        title: "Microsoft Graph",
        desc: "Transfers confirmed delivery sheets into Excel Online.",
      },
      {
        icon: "📊",
        title: "Excel",
        desc: "Final destination for confirmed shipment records.",
      },
    ].map((item, index) => (

      <div
        key={index}
        className={`relative mb-14 flex ${
          index % 2 === 0 ? "md:justify-start" : "md:justify-end"
        }`}
      >

        {/* Timeline Dot */}

        <div className="absolute left-1/2 top-10 hidden h-5 w-5 -translate-x-1/2 rounded-full border-4 border-slate-950 bg-indigo-500 shadow-[0_0_25px_#6366f1] md:block"></div>

        {/* Card */}

        <div className="w-full md:w-[46%]">

          <div className="group rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-indigo-400/40">

            <div className="text-5xl">
              {item.icon}
            </div>

            <h3 className="mt-6 text-2xl font-semibold">
              {item.title}
            </h3>

            <p className="mt-4 leading-7 text-slate-400">
              {item.desc}
            </p>

          </div>

        </div>

      </div>

    ))}

  </div>

</section>

{/* Final CTA */}

<section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">

  <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-14 text-center backdrop-blur-2xl">

    {/* Glow */}

    <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[160px]" />

    <div className="relative">

      <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-5 py-2 text-sm text-indigo-300">
        Ready to Experience It?
      </span>

      <h2 className="mt-8 text-5xl font-extrabold leading-tight">

        Let AI Handle

        <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">

          {" "}Your Delivery Sheets

        </span>

      </h2>

      <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-400">

        Reduce manual work, minimize mistakes and process courier
        delivery sheets faster with AI-powered OCR and automated
        shipment management.

      </p>

      <div className="mt-12 flex flex-wrap justify-center gap-5">

        <button className="rounded-2xl bg-indigo-600 px-8 py-4 font-semibold transition duration-300 hover:scale-105 hover:bg-indigo-500">

          🚀 Launch Demo

        </button>

        <button className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-xl transition duration-300 hover:bg-white/10">

          ⭐ View Source

        </button>

      </div>

    </div>

  </div>

</section>

{/* Footer */}

<footer className="relative border-t border-white/10 py-10">

  <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-center md:flex-row">

    <div>

      <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">

        Delivery Automation

      </h3>

      <p className="mt-2 text-slate-500">

        Built with React · Express · MongoDB Atlas · Firebase · Gemini OCR

      </p>

    </div>

    <div className="flex gap-8 text-slate-400">

      <a
        href="#"
        className="transition hover:text-white"
      >
        GitHub
      </a>

    </div>

  </div>

  <div className="mt-10 text-center text-sm text-slate-600">

    © {new Date().getFullYear()} Bharat Velineni.

  </div>

</footer>
  

    </div>
  );
}