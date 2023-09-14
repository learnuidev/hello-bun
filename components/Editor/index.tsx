'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { defaultExtensions } from './extensions'
import { EditorBubbleMenu } from "./bubble-menu";
import { getPrevText } from './utils';
import { useCompletion } from "ai/react";
import { useEffect, useRef } from 'react';

export const Editor = ({ content, id }: { 
  content: string
  id: string
}) => {



  const editor = useEditor({
    autofocus: true,
    extensions: [
      ...defaultExtensions
    ],
    content: localStorage.getItem(id) && JSON.parse(localStorage.getItem(id) || "") || content,
    // content: "" || content,
    // onUpdate: ({ editor }) => {
    //   if (id) {
    //     localStorage.setItem(id, JSON.stringify(editor.getJSON()))
    //   }
    // }

    onUpdate: ({ editor }) => {
      const selection = editor.state.selection;
      const lastTwo = getPrevText(editor, {
        chars: 2,
      });
      if (lastTwo === "++" && !isLoading) {
        editor.commands.deleteRange({
          from: selection.from - 2,
          to: selection.from,
        });
        complete(
          getPrevText(editor, {
            chars: 5000,
          })
        );
        // complete(e.editor.storage.markdown.getMarkdown());
        // va.track("Autocomplete Shortcut Used");
      } else if (lastTwo === "+s" && !isLoading) {
        // Removes the text from the editor
        editor.commands.deleteRange({
          from: selection.from - 2,
          to: selection.from,
        });
        complete(
          editor.getText()
        ); 

        console.log("TODO: Summarize", editor.getText())



      } else {

        if (id) {
          localStorage.setItem(id, JSON.stringify(editor.getJSON()))
        }

        // onUpdate(e.editor);
        // debouncedUpdates(e);
      }
    },
  })

  const { complete, completion, isLoading, stop } = useCompletion({
    id: "bun",
    api: "",
    onFinish: (_prompt, completion) => {
      editor?.commands.setTextSelection({
        from: editor.state.selection.from - completion.length,
        to: editor.state.selection.from,
      });
    },
    onError: (err) => {
      // toast.error(err.message);
      // if (err.message === "You have reached your request limit for the day.") {
      //   va.track("Rate Limit Reached");
      // }
    },
  });

  const prev = useRef("");

  // Insert chunks of the generated text
  useEffect(() => {
    const diff = completion.slice(prev.current.length);
    prev.current = completion;
    editor?.commands.insertContent(diff);
  }, [isLoading, editor, completion]);


  return (

    <>
       {editor && <EditorBubbleMenu editor={editor} />}
       <EditorContent editor={editor} />
    </>

  )
}

