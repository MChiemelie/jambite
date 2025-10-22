export default function LoadingDots() {
  return (
    <span>
      <span className="motion-safe:motion-preset-fade motion-safe:motion-duration-1000 motion-safe:motion-repeat-infinite motion-safe:motion-delay-500">
        .
      </span>
      <span className="motion-safe:motion-preset-fade motion-safe:motion-duration-1000 motion-safe:motion-repeat-infinite motion-safe:motion-delay-1000">
        .
      </span>
      <span className="motion-safe:motion-preset-fade motion-safe:motion-duration-1000 motion-safe:motion-repeat-infinite motion-safe:motion-delay-1500">
        .
      </span>
    </span>
  );
}
