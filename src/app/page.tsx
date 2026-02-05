
import Header from "@/components/Header";
import Timeline from "@/components/Timeline";
import Footer from "@/components/Footer";
import { TimelineProvider } from "@/context/TimelineContext";
import { ProjectSummarySidebar } from "@/components/ProjectSummarySidebar";
import { stageService } from "@/features/stages/services/stageService";
import { PageViewTracker } from "@/components/PageViewTracker";

// Force dynamic rendering since we are fetching data
export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch stages using service layer
  const stages = await stageService.getAllStages();

  return (
    <TimelineProvider>
      <PageViewTracker />
      <main className="flex h-screen flex-col bg-background relative overflow-hidden">
        {/* Noise texture overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}>
        </div>

        <Header />
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col no-scrollbar">

          {/* Project Summary - Fixed Left relative to Scroll Container */}
          <ProjectSummarySidebar />

          <div className="w-full max-w-screen-2xl mx-auto relative flex-1">

            {/* Main Content - Perfectly Centered */}
            <div className="flex flex-col items-center w-full pt-6 pb-10">
              {/* Spotlight gradient behind timeline */}
              <div className="absolute inset-0 flex justify-center pointer-events-none">
                <div className="w-full max-w-3xl h-full"
                  style={{ background: 'radial-gradient(circle at center, rgba(152, 235, 148, 0.05) 0%, transparent 70%)' }}></div>
              </div>

              <h1 className="text-xl md:text-2xl font-bold text-[#46474A] mb-8 md:mb-12 text-center px-4 md:px-0 relative z-10 max-w-xl leading-tight">
                Murat Sitesi <br className="md:hidden" /> Kentsel Dönüşüm Süreci
              </h1>
              {/* Convert domain models to JSON for client component */}
              <Timeline stages={stages.map(s => s.toJSON()) as any} />
            </div>
          </div>
          <Footer />
        </div>
      </main >
    </TimelineProvider>
  );
}
