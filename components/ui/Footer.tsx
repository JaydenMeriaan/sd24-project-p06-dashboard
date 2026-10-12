export function Footer() {
  return (
    <footer className="bg-[#4C9B6F] dark:bg-[#3a6d54] border-t border-[#FFCC00] dark:border-[#FFCC00] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold dark:text-gray-100 mb-3 text-[#FFCC00]">
              Tokkiemannen
            </h3>
            <p className="text-sm text-gray-200 dark:text-gray-400">
              Voortgang volgen van de Duurzame Ontwikkelingsdoelen
            </p>
          </div>
          <div>
            <h3 className="font-semibold  dark:text-gray-100 mb-3 text-[#FFCC00]">
              Snelkoppelingen
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/overview" className="text-gray-200 dark:text-gray-400 hover:text-[#FFCC00] dark:hover:text-[#FFCC00]">
                  Overzicht
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-200 dark:text-gray-400 hover:text-[#FFCC00] dark:hover:text-[#FFCC00]">
                  Contact
                </a>
              </li>
              <li>
                <a href="/support" className="text-gray-200 dark:text-gray-400 hover:text-[#FFCC00] dark:hover:text-[#FFCC00]">
                  Ondersteuning
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold dark:text-gray-100 mb-3 text-[#FFCC00]">
              Bronnen
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://sdgs.un.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 dark:text-gray-400 hover:text-[#FFCC00] dark:hover:text-[#FFCC00]"
                >
                  VN SDG&apos;s
                </a>
              </li>
              <li>
                <a
                  href="https://unstats.un.org/sdgs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 dark:text-gray-400 hover:text-[#FFCC00] dark:hover:text-[#FFCC00]"
                >
                  SDG Indicatoren
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[#FFCC00] dark:border-[#FFCC00] text-center text-sm text-gray-200 dark:text-gray-400">
          © {new Date().getFullYear()} Tokkiemannen. Gebouwd voor educatieve doeleinden.
        </div>
      </div>
    </footer>
  );
}
