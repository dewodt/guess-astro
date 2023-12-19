import HistorySidebar from "./history-sidebar";

const HistoryLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-auto justify-center p-6 py-12 sm:p-12">
      <div className="flex w-full max-w-[910px] flex-col gap-6 lg:flex-row">
        <HistorySidebar />
        {children}
      </div>
    </div>
  );
};

export default HistoryLayout;
