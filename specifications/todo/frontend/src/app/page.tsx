export default function HomePage() {
  return (
    <main className="container-app py-8">
      <div className="mx-auto max-w-container bg-background-content rounded-lg shadow-sm">
        <header className="text-center py-8">
          <h1 className="app-title text-primary opacity-80 font-normal">
            todos
          </h1>
        </header>

        <div className="px-6 pb-6">
          <p className="text-center text-text-secondary text-sm">
            Project setup complete! Ready for development.
          </p>
        </div>
      </div>
    </main>
  );
}
