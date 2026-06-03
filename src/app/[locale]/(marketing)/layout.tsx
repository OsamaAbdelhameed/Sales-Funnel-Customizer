import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Link } from '@/libs/I18nNavigation';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'RootLayout',
  });

  const { userId } = await auth();

  return (
    <div className="min-h-screen flex flex-col">
      
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold bg-indigo-600 text-white px-3 py-1 rounded-lg">
              SaaS Funnel
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                {t('about_link')}
              </Link>
              <Link href="/portfolio" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                {t('portfolio_link')}
              </Link>
              <a href="https://github.com" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                GitHub
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {!userId ? (
              <>
                <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Log in
                </Link>
                <Link href="/sign-up" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <UserButton />
              </>
            )}
            <div className="ml-2 border-l pl-4">
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {props.children}
      </main>

      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <h3 className="text-xl font-bold mb-4">SaaS Funnel Customizer</h3>
            <p className="text-gray-400 max-w-sm">
              The next generation of sales automation. Build, test, and scale your funnels with Ease.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/">Websites</Link></li>
              <li><Link href="/">PDFs</Link></li>
              <li><Link href="/">Questionnaires</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/">Privacy Policy</Link></li>
              <li><Link href="/">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} SaaS Funnel Customizer. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

