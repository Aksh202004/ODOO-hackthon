"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { QuestionCard } from '@/components/question-card';

interface APIQuestion {
  _id: string;
  title: string;
  description: string;
  author: {
    username: string;
    avatar: string;
  };
  tags: {
    _id: string;
    name: string;
  }[];
  answers: any[];
  createdAt: string;
  votes: number;
  views: number;
  hasAcceptedAnswer: boolean;
}

interface QuestionCardData {
  id: number;
  _id: string;
  title: string;
  excerpt: string;
  votes: number;
  answers: number;
  views: number;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  hasAcceptedAnswer: boolean;
}

export default function TagPage() {
  const [questions, setQuestions] = useState<QuestionCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const tagName = params.tagName;

  useEffect(() => {
    if (tagName) {
      const fetchQuestionsByTag = async () => {
        try {
          setLoading(true);
          const res = await fetch(`http://localhost:5000/api/questions?tags=${tagName}`);
          const data = await res.json();
          if (data.success) {
            const formattedQuestions = data.questions.map((q: APIQuestion, index: number) => ({
              id: index, // Using index as id for now, since the API doesn't provide a number id
              _id: q._id,
              title: q.title,
              excerpt: q.description,
              votes: q.votes,
              answers: q.answers.length,
              views: q.views,
              tags: q.tags.map(t => t.name),
              author: {
                name: q.author.username,
                avatar: q.author.avatar
              },
              createdAt: q.createdAt,
              hasAcceptedAnswer: q.hasAcceptedAnswer
            }));
            setQuestions(formattedQuestions);
          }
        } catch (error) {
          console.error("Failed to fetch questions for this tag", error);
        } finally {
          setLoading(false);
        }
      };
      fetchQuestionsByTag();
    }
  }, [tagName]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Questions tagged with "{tagName}"</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
}
