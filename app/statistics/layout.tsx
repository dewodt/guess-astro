import StatisticsSidebar from "./statistics-sidebar";

const StatisticsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-auto justify-center bg-muted p-5 sm:p-10">
      <div className="flex w-full max-w-4xl flex-col gap-5 md:flex-row">
        <StatisticsSidebar />
        {children}
      </div>
    </div>
  );
};

export default StatisticsLayout;