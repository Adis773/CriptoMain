import { Progress } from "@/components/ui/progress";

interface ProgressWithTextProps {
  value: number;
}

export default function ProgressWithText({ value }: ProgressWithTextProps) {
  return (
    <div className="w-full">
      <Progress 
        value={value} 
        className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden" 
      />
    </div>
  );
}
