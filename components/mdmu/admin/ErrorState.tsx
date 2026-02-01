interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="text-center text-red-500 min-h-screen flex items-center justify-center">
      Failed to load applications: {message}
    </div>
  );
}

