function PageLoader({ text = 'Cargando información...' }) {

  return (
    <main className="
      min-h-screen
      bg-[linear-gradient(180deg,#f7fcff_0%,#edf8ff_100%)]
      flex
      items-center
      justify-center
    ">

      <div className="text-center">

        <div
          className="
            w-12
            h-12
            border-4
            border-[#004aab]
            border-t-transparent
            rounded-full
            animate-spin
            mx-auto
          "
        />

        <p className="
          mt-4
          text-slate-500
          font-medium
        ">
          {text}
        </p>

      </div>

    </main>
  );
}

export default PageLoader;