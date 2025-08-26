import AddClass from "@/components/courses/AddClass";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Module: Thêm lớp (Demo)</h1>
        <AddClass />
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;