// src/__tests__/App.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../components/App';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('http://localhost:4000/questions', (req, res, ctx) => {
    return res(ctx.json([
      {
        id: 1,
        prompt: "lorem testum 1",
        answers: ["choice 1", "choice 2", "choice 3", "choice 4"],
        correctIndex: 0
      },
      {
        id: 2,
        prompt: "lorem testum 2",
        answers: ["choice 1", "choice 2", "choice 3", "choice 4"],
        correctIndex: 2
      }
    ]))
  }),
  rest.post('http://localhost:4000/questions', (req, res, ctx) => {
    return res(ctx.json({
      id: 3,
      prompt: "Test Prompt",
      answers: ["Test Answer 1", "Test Answer 2", "", ""],
      correctIndex: 1
    }))
  }),
  rest.delete('http://localhost:4000/questions/1', (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.patch('http://localhost:4000/questions/1', (req, res, ctx) => {
    return res(ctx.status(200))
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('displays question prompts after fetching', async () => {
  render(<App />);
  expect(await screen.findByText(/lorem testum 1/)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/)).toBeInTheDocument();
});

test('creates a new question when the form is submitted', async () => {
  render(<App />);
  
  fireEvent.change(screen.getByLabelText(/Prompt/), {
    target: { value: "Test Prompt" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 1/), {
    target: { value: "Test Answer 1" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 2/), {
    target: { value: "Test Answer 2" },
  });
  fireEvent.change(screen.getByLabelText(/Correct Answer/), {
    target: { value: "1" },
  });
  
  fireEvent.click(screen.getByText(/Add Question/));
  
  expect(await screen.findByText(/Test Prompt/)).toBeInTheDocument();
});

test('deletes the question when the delete button is clicked', async () => {
  render(<App />);
  
  const deleteButtons = await screen.findAllByText(/Delete/);
  fireEvent.click(deleteButtons[0]);
  
  await waitFor(() => {
    expect(screen.queryByText(/lorem testum 1/)).not.toBeInTheDocument();
  });
  expect(screen.getByText(/lorem testum 2/)).toBeInTheDocument();
});

test('updates the answer when the dropdown is changed', async () => {
  render(<App />);
  
  const dropdowns = await screen.findAllByLabelText(/Correct Answer/);
  fireEvent.change(dropdowns[0], { target: { value: "1" } });
  
  expect(dropdowns[0].value).toBe("1");
});