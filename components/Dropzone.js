// src/components/Dropzone.jsx
'use client';

import React, { forwardRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * A Shadcn-styled file dropzone component.
 */
export const Dropzone = forwardRef(
  (
    {
      className,
      onDropAccepted,
      acceptedFiles = [],
      onFileRemove,
      ...dropzoneOptions
    },
    ref
  ) => {
    const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } =
      useDropzone({
        onDrop: onDropAccepted,
        ...dropzoneOptions,
      });

    const errorMessages = fileRejections.flatMap(({ errors }) =>
      errors.map((error, index) => (
        <p key={error.code + index} className="text-sm underline font-medium">
          Error: {error.message.includes('.pdf')? "File must be a pdf!": "File should be less than 10MB!"}
        </p>
      ))
    );

    const dropzoneClass = cn(
      'flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md transition-colors h-40',
      'cursor-pointer text-muted-foreground hover:bg-muted/50',
      {
        'border-primary bg-primary/10': isDragActive, // Active drag style
        'border-destructive bg-destructive/10': isDragReject, // Rejected drag style
        'border-border': !isDragActive && !isDragReject, // Default style
      },
      className
    );

    return (
      <div className="w-full">
        {/* Dropzone Area: This replaces your former file dropzone element */}
        <div {...getRootProps()} className={dropzoneClass} ref={ref}>
          <input {...getInputProps()} />
          <FileUp className="h-8 w-8 text-primary" />
          <p className="mt-2 text-sm font-medium">
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag & drop notes here, or click to select files'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isDragReject ? 'Invalid file type or size.' : `Max files: ${dropzoneOptions.maxFiles || 'unlimited'}`}
          </p>
        </div>

        {errorMessages.length > 0 && (
          <div className="p-3 mt-2 border border-red-300 text-center rounded-md">
            {errorMessages}
          </div>
        )}

        {/* File Preview List */}
        {acceptedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Files Ready:</p>
            {acceptedFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-3 border rounded-md bg-secondary/10"
              >
                <span className="text-sm truncate">
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </span>
                {onFileRemove && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onFileRemove(file)}
                    aria-label={`Remove file ${file.name}`}
                    className="h-7 w-7"
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Dropzone.displayName = 'Dropzone';