export default function ErrorAlert({ message }: { message: string | null }) {
  return (
    <div className="flex items-start gap-2 rounded border-l-4
      border-red-500 bg-red-50 p-4 text-sm text-red-700"
    >

      <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>

      <span>
        {message}
      </span>

    </div>
  );
};
