import { NotificationSettings } from '../components/settings/NotificationSettings';
import { DisplaySettings } from '../components/settings/DisplaySettings';
import { DataManagement } from '../components/settings/DataManagement';

const Settings = () => {
  return (
    <div className="p-24 space-y-24 animate-fade-in parchment min-h-screen pb-48">
      <header className="space-y-8">
        <h1 className="text-24 font-medium text-indigo-prayer dark:text-night-text">
          Sanctuary
        </h1>
        <p className="text-text-secondary dark:text-night-text-muted text-sm italic">
          Configure your experience.
        </p>
      </header>

      <main className="space-y-32">
        <section className="space-y-16">
          <h2 className="text-12 font-bold text-amber-spirit uppercase tracking-[0.2em] border-b border-border-light dark:border-night-border pb-4">
            Divine Rhythm
          </h2>
          <NotificationSettings />
        </section>

        <section className="space-y-16">
          <h2 className="text-12 font-bold text-amber-spirit uppercase tracking-[0.2em] border-b border-border-light dark:border-night-border pb-4">
            Illumination
          </h2>
          <DisplaySettings />
        </section>

        <section className="space-y-16">
          <h2 className="text-12 font-bold text-burgundy-curtain uppercase tracking-[0.2em] border-b border-burgundy-curtain border-opacity-20 pb-4">
            Archives
          </h2>
          <DataManagement />
        </section>
      </main>
    </div>
  );
};

export default Settings;