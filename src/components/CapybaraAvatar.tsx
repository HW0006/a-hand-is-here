interface CapybaraAvatarProps {
  size?: number;
}

export default function CapybaraAvatar({ size = 19 }: CapybaraAvatarProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <ellipse cx={5.3} cy={6.6} rx={2.5} ry={2.3} fill="#6e5238" />
      <ellipse cx={18.7} cy={6.6} rx={2.5} ry={2.3} fill="#6e5238" />
      <ellipse cx={5.3} cy={6.9} rx={1.3} ry={1.2} fill="#a98257" />
      <ellipse cx={18.7} cy={6.9} rx={1.3} ry={1.2} fill="#a98257" />
      <ellipse cx={12} cy={13.4} rx={9} ry={7.6} fill="#9c7850" />
      <ellipse cx={12} cy={16.8} rx={5.2} ry={3.4} fill="#e3c49c" />
      <ellipse cx={9.4} cy={17.6} rx={0.55} ry={0.8} fill="#4a3826" />
      <ellipse cx={14.6} cy={17.6} rx={0.55} ry={0.8} fill="#4a3826" />
      <circle cx={8.6} cy={12} r={1.05} fill="#2b2016" />
      <circle cx={15.4} cy={12} r={1.05} fill="#2b2016" />
    </svg>
  );
}
