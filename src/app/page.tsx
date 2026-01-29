
import Header from "@/components/Header";
import Timeline from "@/components/Timeline";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex h-screen flex-col bg-background relative">
      {/* Noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}>
      </div>

      <Header />
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="w-full max-w-screen-2xl mx-auto relative flex flex-col lg:flex-row items-start justify-center pt-6 pb-10 z-10">
          {/* Project Summary - Desktop Only */}
          <aside className="hidden lg:block w-64 ml-8 mr-4 mt-0 sticky top-0">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-fluid-h3 text-[#46474A] mb-4">Proje Özeti</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Proje Adı</p>
                  <p className="font-semibold text-gray-700 dark:text-gray-300">Murat Sitesi</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Toplam Aşama</p>
                  <p className="font-semibold text-gray-700 dark:text-gray-300">11 Aşama</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Aktif Aşama</p>
                  <p className="font-semibold text-[#98EB94]">Riskli Yapı İlanı</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">İlerleme</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2">
                    <div className="bg-[#98EB94] h-3 rounded-full" style={{ width: '54%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">6/11 Tamamlandı</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex flex-col items-center flex-1 relative w-full">
            {/* Spotlight gradient behind timeline */}
            <div className="absolute inset-0 flex justify-center pointer-events-none">
              <div className="w-full max-w-3xl h-full"
                style={{ background: 'radial-gradient(circle at center, rgba(152, 235, 148, 0.05) 0%, transparent 70%)' }}></div>
            </div>

            <h1 className="text-fluid-h1 text-[#46474A] mb-8 md:mb-12 text-center px-4 md:px-0 relative z-10">
              Murat Sitesi <br className="md:hidden" /> Kentsel Dönüşüm Süreci
            </h1>
            <Timeline />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
