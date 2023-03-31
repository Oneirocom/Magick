// DOCUMENTED 
/**
 * UploadFileButton component provides a button to upload a file and calls the uploadFile function from the 
 * useUploadFile hook on file selection 
 * @param enforce - type of enforcement selected to upload the file
 * @param purpose - purpose of the OpenAI request
 * @returns React Component
 */
import React, { useEffect, useRef } from "react";
import { OpenAI } from "../types/openai";
import useUploadFile, { Enforce, MimeTypes } from "./useUploadFile";
import Button from "@mui/material/Button";
import UploadFileIcon from "@mui/icons-material/UploadFile";

interface Props {
  enforce: Enforce;
  purpose: OpenAI.Purpose;
}

export default function UploadFileButton({ enforce, purpose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isLoading, uploadFile } = useUploadFile(purpose, enforce);

  /**
   * Add a handler to trigger the uploadFile function when the user drops files onto the page
   * @param uploadFile - function that uploads a file
   */
  function useOnDrop(uploadFile: (file: File) => void) {
    useEffect(function () {
      /**
       * Prevents the default behavior of the browser opening the file when it is dragged over the page.
       * @param event - DragEvent object representing the drop event
       */
      function onDragOver(event: DragEvent) {
        event.preventDefault();
      }
      document.addEventListener("dragover", onDragOver);
      return () => document.removeEventListener("dragover", onDragOver);
    }, []);

    useEffect(
      function () {
        /**
         * Prevents the default behavior of the browser opening the file after it has been dropped on the page.
         * Triggers the uploadFile function for every file dropped.
         * @param event - DragEvent object representing the drop event
         */
        function onDrop(event: DragEvent) {
          event.preventDefault();
          const files = event.dataTransfer?.files;
          if (files) {
            for (let i = 0; i < files.length; i++) {
              uploadFile(files[i]);
            }
          }
        }

        document.addEventListener("drop", onDrop);
        return () => document.removeEventListener("drop", onDrop);
      },
      [uploadFile]
    );
  }

  useOnDrop(uploadFile);

  /**
   * Calls the upload function when the user selects a file
   */
  async function onChange() {
    if (!inputRef.current) return;
    const file = inputRef.current.files?.[0];
    if (file) await uploadFile(file);
    inputRef.current.value = "";
  }

  return (
    <span>
      <input
        accept={MimeTypes.join()}
        onChange={onChange}
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
      />
      <Button
        variant="contained"
        disabled={isLoading}
        style={{backgroundColor: "purple", color: "white" }}
        onClick={() => inputRef.current?.click()}
        startIcon={<UploadFileIcon />}
      >
        Upload File
      </Button>
    </span>
  );
}

/******/
/**
 * useOnDrop is a custom hook that adds event listeners to the page to detect dropped files and then calls the provided
 * callback function for that file
 */