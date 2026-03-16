import { LandingContent, LandingTemplate } from '@ig/templates/LandingTemplate';
import { NextPage } from 'next';

const content: LandingContent = {
  navbar: {
    title: 'IGDownloader',
    buttonText: 'Open Downloader',
    buttonHref: '/app',
  },
  hero: {
    title: 'Download Instagram Photos & Videos Instantly',
    tagline:
      'Save Instagram posts, reels, and videos quickly by pasting a link. Fast, simple, and runs right in your browser.',
    buttonText: 'Start Downloading',
    buttonHref: '/app',
  },
  features: {
    title: 'Features',
    items: [
      {
        id: 'easy-download',
        emoji: '⬇️',
        title: 'Easy Downloads',
        description:
          'Paste an Instagram post or reel link and download the media instantly.',
      },
      {
        id: 'photo-video-support',
        emoji: '📷',
        title: 'Photo & Video Support',
        description:
          'Download photos, videos, reels, and carousel posts with ease.',
      },
      {
        id: 'high-quality',
        emoji: '✨',
        title: 'High Quality',
        description:
          'Save images and videos in their original quality whenever available.',
      },
      {
        id: 'privacy-first',
        emoji: '🔒',
        title: 'Privacy First',
        description:
          'No accounts, no tracking, and no data stored. Just paste and download.',
      },
      {
        id: 'fast-processing',
        emoji: '⚡',
        title: 'Fast Processing',
        description:
          'Quickly fetch and prepare downloads so you can save content in seconds.',
      },
      {
        id: 'mobile-friendly',
        emoji: '📱',
        title: 'Mobile Friendly',
        description:
          'Works smoothly on phones, tablets, and desktops without installing anything.',
      },
    ],
  },
  cta: {
    title: 'Save Instagram Media Now',
    description:
      'Download Instagram photos and videos quickly with no signup required.',
    buttonText: 'Open Downloader',
    buttonHref: '/app',
  },
  footer: {
    name: 'IGDownloader',
  },
};

const HomePage: NextPage = () => {
  return <LandingTemplate content={content} />;
};

export default HomePage;
