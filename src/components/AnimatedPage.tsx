import type { ReactNode } from 'react';

const AnimatedPage = ({ children }: { children: ReactNode }) => (
  <div className="animate-fade-in-up">
    {children}
  </div>
);

export default AnimatedPage;
