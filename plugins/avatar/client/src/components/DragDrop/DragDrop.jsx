import React from "react"
import { useDropzone } from "react-dropzone"
import styles from "./DragDrop.module.css"

function DragDrop({ onDrop, accept }) {
    const { getRootProps, getInputProps, isDragActive  } = useDropzone({
            accept,
            onDrop,
            noClick: true,
            noKeyboard: true
        });

    return (
        <div>
            <div className={styles["DragDropzone"]} {...getRootProps()}>
                <input className={styles["input-zone"]} {...getInputProps()} />
                <div className={styles["text-center"]}>
                    {isDragActive ? (
                        <p className={styles["dropzone-content"]}>
                            Release to drop the file here
                        </p>
                    ) : (
                        <p className={styles["dropzone-content"]}>
                            Drag and drop VRM file here.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DragDrop;