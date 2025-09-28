import { Status } from '@/components/custom';

const blog = {
  image: '/assets/blog.svg',
  desc1: 'The blog is in progress.',
  desc2: 'Watch out!',
};

export default function BlogPage() {
  return <Status image={blog.image} desc1={blog.desc1} desc2={blog.desc2} />;
}
