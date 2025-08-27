import { Link } from "react-router-dom";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Blank App</h1>
        <p className="text-xl text-gray-600 mb-6">
          Start building your amazing project here!
        </p>

        <div className="space-x-3">
          <Link
            to="/courses/add"
            className="inline-block px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white"
          >
            Mở trang Thêm lớp
          </Link>

          <a
            href="https://www.dyad.sh/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 text-gray-700"
          >
            Tài liệu Dyad
          </a>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;