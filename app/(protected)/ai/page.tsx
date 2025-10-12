import { Status } from '@/components/custom';

const chat = {
  image: '/assets/chat.svg',
  desc1: 'The AI chat will soon be available.',
  desc2: "What you're expecting!"
};

export default function ChatPage() {
  return <Status image={chat.image} desc1={chat.desc1} desc2={chat.desc2} />;
}
