'use client';

import { Message } from 'ai/react';
import { useChat } from 'ai/react';
import { ChatRequest, FunctionCallHandler, nanoid } from 'ai';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'


import gfm from 'remark-gfm'


import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you

import ReactMarkdown from 'react-markdown'

export default function Chat() {
  const functionCallHandler: FunctionCallHandler = async (
    chatMessages,
    functionCall,
  ) => {
    if (functionCall.name === 'eval_code_in_browser') {
      if (functionCall.arguments) {
        // Parsing here does not always work since it seems that some characters in generated code aren't escaped properly.
        const parsedFunctionCallArguments: { code: string } = JSON.parse(
          functionCall.arguments,
        );
        // WARNING: Do NOT do this in real-world applications!
        eval(parsedFunctionCallArguments.code);
        const functionResponse = {
          messages: [
            ...chatMessages,
            {
              id: nanoid(),
              name: 'eval_code_in_browser',
              role: 'function' as const,
              content: parsedFunctionCallArguments.code,
            },
          ],
        };
        return functionResponse;
      }
    }
  };

  const { messages, input, handleInputChange, handleSubmit, data } = useChat({
    api: '/api/chat-with-functions',
    experimental_onFunctionCall: functionCallHandler,
  });

  // Generate a map of message role to text color
  const roleToColorMap: Record<Message['role'], string> = {
    system: 'red',
    user: 'black',
    function: 'blue',
    assistant: 'green',
  };

  return (
    <div className="flex flex-col w-full py-24 mx-auto stretch space-y-8 max-w-3xl">
      {messages.length > 0
        ? messages.map((m: Message) => {

          return (
            <div
              key={m.id}
              className="whitespace-pre-wrap"
              style={{ color: roleToColorMap[m.role] }}
            >
              <ReactMarkdown 
                children={m.content || JSON.stringify(m.function_call)} 
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex, gfm]} 
              />
            </div>
          )
        })
        : null}
      <div id="chart-goes-here"></div>
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-3xl p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
