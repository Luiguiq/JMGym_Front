function PageLoader({ text = 'Cargando información...' }) {

  return (
    <main className="
      min-h-screen
      bg-surface
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
            border-primary
            border-t-transparent
            rounded-full
            animate-spin
            mx-auto
          "
        />

        <p className="
          mt-4
          text-muted
          font-medium
        ">
          {text}
        </p>

      </div>

    </main>
  );
}

export default PageLoader;