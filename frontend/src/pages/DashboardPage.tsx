import { ModuleDirectory } from "../components/ModuleDirectory";
import { PageTransition } from "../components/PageTransition";

/** Top Management: all 18 modules can be opened directly from this launchpad. */
export function DashboardPage() {
  return (
    <PageTransition>
      <section className="page-canvas min-h-full px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
        <ModuleDirectory />
      </section>
    </PageTransition>
  );
}
