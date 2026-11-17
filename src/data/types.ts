export type Question = {
  prompt: string;
  options: [string, string, string, string];
  answer: number;
  explanation: string;
};

export type Term = {
  id: string;
  name: string;
  aliases: string[];
  summary: string;
  explanation: string;
  example: string;
  misconception: string;
  source: string;
  question: Question;
};

export type Pack = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  colour: "blue" | "orange" | "green" | "pink" | "yellow";
  symbol:
    | "spark"
    | "search"
    | "agent"
    | "nodes"
    | "eye"
    | "gauge"
    | "code"
    | "database"
    | "system"
    | "cloud";
  level: "Start here" | "Build on it" | "Go deeper";
  lessons: [string, string, string, string, string];
  terms: Term[];
};
export type PackPreview = Omit<Pack, "terms" | "lessons">;
