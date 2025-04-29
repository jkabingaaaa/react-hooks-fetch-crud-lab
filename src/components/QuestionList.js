import React from 'react';
import QuestionItem from './QuestionItem';

function QuestionList({ questions, onDeleteQuestion, onUpdateQuestion }) {
  function handleDelete(id) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'DELETE',
    })
      .then(() => onDeleteQuestion(id));
  }

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {questions.map((question) => (
          <QuestionItem 
            key={question.id} 
            question={question} 
            onDeleteClick={handleDelete}
            onUpdateQuestion={onUpdateQuestion}
          />
        ))}
      </ul>
    </section>
  );
}

export default QuestionList;