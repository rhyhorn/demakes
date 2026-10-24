interface HintCardProps {
  title: string;
  /** Lines of description under the title, one paragraph each. May be empty. */
  details: readonly string[];
}

/** The look of every hint: a title and an optional description. */
export function HintCard({ title, details }: HintCardProps) {
  return (
    <div className="flex flex-col items-center gap-[calc(12*var(--px))] text-center">
      <p className="text-[length:calc(40*var(--px))] font-bold text-[#f4e3c1]">{title}</p>
      {details.length > 0 && (
        <ul className="flex flex-col gap-[calc(6*var(--px))] text-[length:calc(24*var(--px))] leading-snug text-[#c9c3b4]">
          {details.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
