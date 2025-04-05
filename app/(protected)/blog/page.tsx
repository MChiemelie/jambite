import { Status } from '@/components/custom';

const blog = {
  image: '/assets/blog.svg',
  desc1: "We're still working on the blog",
  desc2: 'Watch out, it will be massive!',
};

export default function BlogPage() {
  return <Status image={blog.image} desc1={blog.desc1} desc2={blog.desc2} />;
}
