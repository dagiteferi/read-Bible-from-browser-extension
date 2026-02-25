import React from 'react';
import { Card } from '../common/Card';

export const UnitList: React.FC = () => {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-indigo-deep dark:text-dark-indigo">Completed Readings</h2>
      <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">
        (Placeholder for a list of your completed reading units.)
      </p>
      <ul className="mt-4 space-y-2 text-text-primary dark:text-dark-text">
        <li className="p-2 bg-gray-50 dark:bg-dark-surface-light rounded-md">መዝሙረ ዳዊት 1:1-6 (Completed on 2026-02-25)</li>
        <li className="p-2 bg-gray-50 dark:bg-dark-surface-light rounded-md">ዮሐንስ 3:16-17 (Completed on 2026-02-24)</li>
      </ul>
    </Card>
  );
};
