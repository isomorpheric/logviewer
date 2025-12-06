import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

const StatusBarSkeleton = () => {
  return (
    <div data-testid="statusbar-skeleton" aria-label="Loading status bar" role="status">
      <LoadingSkeleton width="100%" height={"36px"} />
    </div>
  );
};

export default StatusBarSkeleton;
