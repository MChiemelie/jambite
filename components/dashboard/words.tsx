import { Word } from '@/components/custom';
import xml2js from 'xml2js';

export default async function Words() {
  const res = await fetch('https://www.merriam-webster.com/wotd/feed/rss2');
  const xmlData = await res.text();
  const parser = new xml2js.Parser();

  const jsonData = (await new Promise((resolve, reject) =>
    parser.parseString(xmlData, (err: any, result: any) => {
      if (err) reject(err);
      else resolve(result);
    })
  )) as any;

  const items = jsonData?.rss?.channel?.[0]?.item || [];

  if (items.length === 0) {
    return <p>No words available at the moment. Please try again later.</p>;
  }

  const parsedItems = items.map((item: any) => {
    const pubDateRaw = item?.pubDate?.[0] || null;
    const pubDate = pubDateRaw ? new Date(pubDateRaw).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : null;
    const summary = item?.['itunes:summary']?.[0] || '';
    const titleMatch = summary.match(/^Merriam-Webster's Word of the Day for .*? is: (.+?) /);
    const word = titleMatch ? titleMatch[1] : 'No word available';

    const pronunciationMatch = summary.match(/\\([A-Za-z\-\\]+)\\/);
    const pronunciation = pronunciationMatch ? pronunciationMatch[0] : null;

    const partOfSpeechMatch = summary.match(/\b(adjective|noun|verb|adverb)\b/);
    const partOfSpeech = partOfSpeechMatch ? partOfSpeechMatch[0] : null;

    const nounTypeMatch = summary.match(/(plural|singular|mass)/);
    const nounType = nounTypeMatch ? nounTypeMatch[0] : null;

    const meaningMatch = summary.match(/(?:verb|noun|adjective|adverb)\s+(?:plural|singular|mass)?\s*(.*?)(?=\.\s|$)/);
    const meaning = meaningMatch && meaningMatch[1] ? meaningMatch[1].trim() : null;

    const meaningHTML = meaning ? meaning.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" class="text-blue-500 underline hover:text-blue-700" target="_blank" rel="noopener noreferrer">$1</a>') : null;

    const exampleMatch = summary.match(/\/\/ (.+?)(?=\.\s|(?=\.\[)|$)/);
    const example = exampleMatch ? exampleMatch[1] : null;

    const exampleMarkdown = example;
    const exampleHTML = exampleMarkdown?.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" class="text-blue-500 underline hover:text-blue-700" target="_blank" rel="noopener noreferrer">$1</a>');

    const audioUrl = item.enclosure ? item.enclosure[0].$.url : null;

    return {
      word,
      pronunciation,
      partOfSpeech,
      nounType,
      meaning,
      meaningHTML,
      example,
      exampleHTML,
      audioUrl,
      pubDate,
    };
  });

  return <Word words={parsedItems} />;
}
