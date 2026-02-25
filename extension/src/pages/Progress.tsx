import { TimelineChart } from '../components/progress/TimelineChart';
import { UnitList } from '../components/progress/UnitList';
import { Statistics } from '../components/progress/Statistics';

const Progress = () => {
  return (
    <div className="p-24 space-y-24 animate-fade-in parchment min-h-screen pb-48">
      <header className="space-y-8">
        <h1 className="text-24 font-medium text-indigo-prayer dark:text-night-text">
          Growth
        </h1>
        <p className="text-text-secondary dark:text-night-text-muted text-sm italic">
          Behold your journey through the Holy Word.
        </p>
      </header>

      <main className="space-y-32">
        <TimelineChart />
        <Statistics />
        <UnitList />
      </main>
    </div>
  );
};

export default Progress;