import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface ExamPart {
  id: string;
  name: string;
}

const TestPartsTabs: React.FC = () => {
  const [parts, setParts] = React.useState<ExamPart[]>([
    { id: 'part1', name: 'Phần 1' },
    { id: 'part2', name: 'Phần 2' },
    { id: 'part3', name: 'Phần 3' },
  ]);
  const [selectedTab, setSelectedTab] = React.useState(parts[0].id);

  React.useEffect(() => {
    if (!parts.find(p => p.id === selectedTab)) {
      setSelectedTab(parts[0]?.id || '');
    }
  }, [parts, selectedTab]);

  const setTwoParts = () => {
    setParts([
      { id: 'part1', name: 'Phần 1' },
      { id: 'part2', name: 'Phần 2' },
    ]);
  };

  const setThreeParts = () => {
    setParts([
      { id: 'part1', name: 'Phần 1' },
      { id: 'part2', name: 'Phần 2' },
      { id: 'part3', name: 'Phần 3' },
    ]);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Button onClick={setTwoParts} className="bg-orange-500 hover:bg-orange-600 text-white">2 Phần thi</Button>
        <Button onClick={setThreeParts} className="bg-orange-500 hover:bg-orange-600 text-white">3 Phần thi</Button>
      </div>
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          {parts.map((part) => (
            <TabsTrigger key={part.id} value={part.id}>
              {part.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {parts.map((part) => (
          <TabsContent key={part.id} value={part.id}>
            Nội dung {part.name}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TestPartsTabs;