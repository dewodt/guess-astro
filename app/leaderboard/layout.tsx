import LeaderboardSidebar from "./leaderboard-sidebar";

const LeaderboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-auto justify-center p-5 sm:p-10">
      <div className="flex w-full max-w-4xl flex-col gap-5 md:flex-row">
        <LeaderboardSidebar />
        {children}
      </div>
    </div>
  );
};

export default LeaderboardLayout;
