export type Badge = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};

export type BadgeProps = {
  badges: Badge[];
};
