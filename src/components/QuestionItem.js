// src/components/QuestionItem.js
function QuestionItem({ question, onDeleteClick, onUpdateQuestion }) {
  function handleCorrectAnswerChange(event) {
    const newCorrectIndex = parseInt(event.target.value);
    
    fetch(`http://localhost:4000/questions/${question.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correctIndex: newCorrectIndex,
      }),
    })
      .then(res => res.json())
      .then(updatedQuestion => onUpdateQuestion(updatedQuestion));
  }

  return (
    <li>
      <h4>Question {question.id}</h4>
      <h5>Prompt: {question.prompt}</h5>
      <label>
        Correct Answer:
        <select 
          defaultValue={question.correctIndex} 
          onChange={handleCorrectAnswerChange}
        >
          {question.answers.map((answer, index) => (
            <option key={index} value={index}>
              {answer}
            </option>
          ))}
        </select>
      </label>
      <button onClick={() => onDeleteClick(question.id)}>Delete</button>
    </li>
  );
}

export default QuestionItem;