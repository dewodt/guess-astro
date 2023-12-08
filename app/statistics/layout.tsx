import StatisticsSidebar from "./statistics-sidebar";

const StatisticsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-auto justify-center p-6 py-12 sm:p-12">
      <div className="flex w-full max-w-4xl flex-col gap-6 md:flex-row">
        <StatisticsSidebar />
        {children}
      </div>
    </div>
  );
};

export default StatisticsLayout;
