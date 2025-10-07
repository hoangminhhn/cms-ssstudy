"use client";

import React from "react";
import DocumentForm from "@/components/documents/DocumentForm";
import CoverUploader from "@/components/documents/CoverUploader";
import ConfigPanel from "@/components/documents/ConfigPanel";
import FileDropzone from "@/components/documents/FileDropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";

/**
 * Page-level component composes multiple small components:
 * - left: DocumentForm + FileDropzone
 * - right: CoverUploader + ConfigPanel
 *
 * It keeps the state and passes handlers down to child components.
 */

const AddDocument: React.FC = () => {
  // form state
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [shortDesc, setShortDesc] = React.useState("");
  const [content, setContent] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [classLevel, setClassLevel] = React.useState("");
  // cover
  const [coverPreview, setCoverPreview] = React.useState<string | null>(null);
  // config
  const [displayMode, setDisplayMode] = React.useState<string>("free");
  const [allowFiles, setAllowFiles] = React.useState<boolean>(true);
  // files attachments
  const [files, setFiles] = React.useState<File[]>([]);

  const handleCreate = () => {
    // Demo payload
    const payload = {
      title,
      slug,
      shortDesc,
      content,
      category,
      subject,
      classLevel,
      displayMode,
      allowFiles,
      attachments: files.map((f) => ({ name: f.name, size: f.size })),
      hasCover: !!coverPreview,
    };
    // In real app you'd call API; here we just console and toast
    // eslint-disable-next-line no-console
    console.log("Create document payload:", payload);
    alert("Tạo tài liệu (demo). Kiểm tra console để xem payload.");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left column */}
        <div className="space-y-6">
          <DocumentForm
            title={title}
            setTitle={setTitle}
            slug={slug}
            setSlug={setSlug}
            shortDesc={shortDesc}
            setShortDesc={setShortDesc}
            content={content}
            setContent={setContent}
            category={category}
            setCategory={setCategory}
            subject={subject}
            setSubject={setSubject}
            classLevel={classLevel}
            setClassLevel={setClassLevel}
          />

          <FileDropzone files={files} setFiles={setFiles} />
        </div>

        {/* Right column */}
        <aside className="space-y-4">
          <CoverUploader coverPreview={coverPreview} setCoverPreview={setCoverPreview} />

          <ConfigPanel
            displayMode={displayMode}
            setDisplayMode={setDisplayMode}
            allowFiles={allowFiles}
            setAllowFiles={setAllowFiles}
            onCreate={handleCreate}
          />
        </aside>
      </div>

      <MadeWithDyad />
    </div>
  );
};

export default AddDocument;