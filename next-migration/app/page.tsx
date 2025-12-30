export default function Home() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="font-serif text-h1 text-Color-Dark-500">
          Diamonds by CS
        </h1>

        <p className="font-serif-body text-body-lg text-Color-Dark-500 max-w-2xl mx-auto">
          Timeless Elegance, Crafted with Precision
        </p>

        <div className="pt-8">
          <button className="btn-primary">
            Explore Collection
          </button>
        </div>

        <div className="mt-12 p-6 bg-Color-Primary-Beige rounded-xl shadow-lg">
          <h2 className="font-serif text-h3 text-Color-Dark-500 mb-4">
            Phase 1: Setup Complete ✓
          </h2>
          <ul className="text-left space-y-2 text-Color-Dark-500 font-serif-body">
            <li>✓ Next.js 16 with App Router initialized</li>
            <li>✓ Tailwind v3 configured with your design system</li>
            <li>✓ All design tokens and styles migrated</li>
            <li>✓ ImageKit integration ready</li>
            <li>✓ Supabase client configured</li>
            <li>✓ Essential dependencies installed</li>
            <li>✓ Environment variables set up</li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-surface-elevated rounded-lg border border-Color-Champagne-Gold">
          <p className="text-sm text-Color-Dark-500">
            <strong>Next:</strong> Run <code className="px-2 py-1 bg-Color-Primary-Beige rounded">npm run dev</code> in the next-migration folder to see your site!
          </p>
        </div>
      </div>
    </div>
  );
}
