import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-5xl font-bold">
        <div className="flex justify-between rounded-lg bg-black p-4 text-white">hello</div>
      </h1>
      <Button>click me </Button>
    </div>
  );
}
