import React, { useState, useEffect } from 'react';
import QuestionForm from './QuestionForm';
import QuestionList from './QuestionList';

function App() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch('http://localhost:4000/questions', { signal })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setQuestions(data))
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Error fetching questions:', error);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  function handleAddQuestion(newQuestion) {
    setQuestions([...questions, newQuestion]);
  }

  function handleDeleteQuestion(id) {
    setQuestions(questions.filter(question => question.id !== id));
  }

  function handleUpdateQuestion(updatedQuestion) {
    setQuestions(questions.map(question => 
      question.id === updatedQuestion.id ? updatedQuestion : question
    ));
  }

  return (
    <main>
      <QuestionForm onAddQuestion={handleAddQuestion} />
      <QuestionList 
        questions={questions} 
        onDeleteQuestion={handleDeleteQuestion}
        onUpdateQuestion={handleUpdateQuestion}
      />
    </main>
  );
}

export default App;