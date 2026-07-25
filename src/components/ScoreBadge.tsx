interface Props {
  score: number;
}

const ScoreBadge = ({ score }: Props) => {
  const color =
    score >= 80
      ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
      : score >= 60
      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
      : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';

  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${color}`}>
      {score}
    </span>
  );
};

export default ScoreBadge;
