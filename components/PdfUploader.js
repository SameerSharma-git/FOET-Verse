'use client';

import React, { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
// Import custom and shadcn components
import { Dropzone } from '@/components/Dropzone';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ToastContainer, toast } from 'react-toastify';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useTheme } from 'next-themes';
import { Input } from './ui/input';

// --- DUMMY DATA ---
const BRANCHES = ['COMMON', 'CS', 'ME', 'EE', 'CE', 'EC'];
const YEAR_OPTIONS = ['1', '2', '3', '4'];
const SEMESTER_OPTIONS = ['1', '2'];
// const RESOURCE_TYPE_OPTIONS = ['notes', 'PYQ', 'DPP', 'syllabus', 'marking-scheme', 'prev-year-paper', 'other'];
const RESOURCE_TYPE_OPTIONS = [
  { name: 'Notes', value: 'notes' },
  { name: 'PYQ', value: 'PYQ' },
  { name: 'DPP', value: 'DPP' },
  { name: 'Syllabus', value: 'syllabus' },
  { name: 'Marking Scheme', value: 'marking-scheme' },
  { name: 'Prev Year Paper', value: 'prev-year-paper' },
  { name: 'Other', value: 'other' },
];

const SUBJECTS_BY_BRANCH = {
  COMMON: ["Basic Electrical Eng.", "Basic Electronics Eng.", "Maths - 1", "Professional Communication", "Basic Mechanical Eng.", "Basic Civil Eng.", "Graphics", "Engineering Physics", "Chemistry"],
  CS: [
    'Data Structures', 'Design and Analysis of Algorithms', 'Operating Systems', 
    'Computer Organization and Architecture', 'Discrete Mathematics', 
    'Database Management Systems', 'Software Engineering', 'Theory of Computation', 
    'Computer Networks', 'Artificial Intelligence', 'Compiler Design', 'Cloud Computing'
  ],
  ME: [
    'Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'Heat and Mass Transfer', 
    'Manufacturing Processes', 'Kinematics of Machinery', 'Internal Combustion Engines', 
    'Strength of Materials', 'CAD/CAM', 'Automobile Engineering', 'Industrial Engineering'
  ],
  EE: [
    'Circuit Theory', 'Power Systems', 'Control Systems', 'Electrical Machines', 
    'Power Electronics', 'Electromagnetic Fields', 'Signals and Systems', 
    'Electrical Measurements', 'Microprocessors', 'Renewable Energy Sources'
  ],
  CE: [
    'Structural Analysis', 'Geotechnical Engineering', 'Surveying', 
    'Concrete Technology', 'Transportation Engineering', 'Hydrology & Water Resources', 
    'Environmental Engineering', 'Building Materials', 'Estimation and Costing'
  ],
  ECE: [
    'Digital Electronics', 'Communication Systems', 'Microcontrollers', 
    'Analog Circuits', 'VLSI Design', 'Digital Signal Processing', 
    'Antenna and Wave Propagation', 'Embedded Systems', 'Optical Fiber Communication'
  ],
};


export default function UploadNotesForm() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    branch: '',
    subject: '',
    fileName: '',
    year: '',
    semester: '',
    resource_type: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { theme } = useTheme();

  const showToast = (message, type = 'info') => {
    toast(message, { type, position: "bottom-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: theme, });
  }

  const availableSubjects = useMemo(() => SUBJECTS_BY_BRANCH[formData.branch] || [], [formData.branch]);
  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'branch') setFormData(prev => ({ ...prev, subject: '' }));
  };

  const onDropAccepted = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (files.length > 0) URL.revokeObjectURL(files[0].preview);
      const newFile = {
        name: file.name, size: file.size, preview: URL.createObjectURL(file), file: file,
      };
      setFiles([newFile]);
    }
  }, [files]);

  const handleFileRemove = (fileToRemove) => {
    URL.revokeObjectURL(fileToRemove.preview);
    setFiles([]);
  };

  const dropzoneConfig = {
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.branch || !formData.subject) {
      showToast("Submission failed: Please fill in all required fields (Branch, Subject).");
      return;
    }
    if (files.length === 0) {
      showToast("Please upload a single PDF file.");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0)

    const fileToUpload = files[0].file;
    const combinedFormData = new FormData();

    // 1. Append File (Key 'file' must match server endpoint)
    combinedFormData.append('file', fileToUpload, fileToUpload.name);

    // 2. Append Metadata
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        // Append metadata fields to the same FormData object
        combinedFormData.append(key, formData[key]);
      }
    });

    try {
      // Send combined FormData to the single file upload endpoint

      const response = await axios.post('/api/upload-pdf', combinedFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 0));
          setUploadProgress(percentCompleted)
        }
      })

      // updateUser({_id: })

      showToast(`Notes for ${formData.subject} saved successfully!`);

      // Reset form on success
      setFormData({ branch: '', subject: '', year: '', semester: '' });
      handleFileRemove(files[0]);
      setUploadProgress(100);
    } catch (error) {
      console.error('Submission failed:', error.response?.data || error.message);
      setUploadProgress(0);
      showToast(`Submission failed: ${error.response?.data?.error || error.message || 'An unknown error occurred.'}`);
    } finally {
      setTimeout(() => setIsSubmitting(false), 500)
    }
  };


  return (
    <div className="w-full max-w-lg mx-auto p-6 border rounded-lg shadow-lg">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6">Upload University Notes</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Branch Select (Required) */}
        <div>
          <Label htmlFor="branch">Branch <span className="text-red-500">*</span></Label>
          <Select onValueChange={(value) => handleSelectChange('branch', value)} value={formData.branch}>
            <SelectTrigger id="branch" className="w-full mt-1"><SelectValue placeholder="Select Branch" /></SelectTrigger>
            <SelectContent>{BRANCHES.map(branch => (<SelectItem key={branch} value={branch}>{branch}</SelectItem>))}</SelectContent>
          </Select>
        </div>

        {/* Subject Select (Required & Dependent) */}
        <div>
          <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
          <Select onValueChange={(value) => handleSelectChange('subject', value)} value={formData.subject} disabled={!formData.branch || availableSubjects.length === 0}>
            <SelectTrigger id="subject" className="w-full mt-1"><SelectValue placeholder={formData.branch ? "Select Subject" : "Select Branch first"} /></SelectTrigger>
            <SelectContent>{availableSubjects.map(subject => (<SelectItem key={subject} value={subject}>{subject}</SelectItem>))}</SelectContent>
          </Select>
        </div>

        {/* FileName Select (Required) */}
        <div>
          <Label className={"mb-1"} htmlFor="fileName">Filename <span className="text-red-500">*</span></Label>
          <Input value={formData?.fileName || ""} onChange={handleInputChange} id="fileName" name="fileName" placeholder="Add a Filename (This will be shown to users)" />
        </div>

        {/* Year and Semester (Optional) - Side-by-side */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="year">Year (Optional)</Label>
            <Select onValueChange={(value) => handleSelectChange('year', value)} value={formData.year}>
              <SelectTrigger id="year" className="w-full mt-1"><SelectValue placeholder="Select Year" /></SelectTrigger>
              <SelectContent>{YEAR_OPTIONS.map(year => (<SelectItem key={year} value={year}>{year}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label htmlFor="semester">Semester (Optional)</Label>
            <Select onValueChange={(value) => handleSelectChange('semester', value)} value={formData.semester}>
              <SelectTrigger id="semester" className="w-full mt-1"><SelectValue placeholder="Select Semester" /></SelectTrigger>
              <SelectContent>{SEMESTER_OPTIONS.map(semester => (<SelectItem key={semester} value={semester}>{semester}</SelectItem>))}</SelectContent>
            </Select>
          </div>
        </div>

        {/* RESOURCE TYPE Select (Required) */}
        <div>
          <Label htmlFor="resource_type">Resource Type <span className="text-red-500">*</span></Label>
          <Select onValueChange={(value) => handleSelectChange('resource_type', value)} value={formData.resource_type}>
            <SelectTrigger id="resource_type" className="w-full mt-1"><SelectValue placeholder="Select Resource Type" /></SelectTrigger>
            <SelectContent>{RESOURCE_TYPE_OPTIONS.map(type => (<SelectItem key={type.name} value={type.value}>{type.name}</SelectItem>))}</SelectContent>
          </Select>
        </div>

        {/* DROPZONE ELEMENT (Single File PDF) */}
        <Dropzone onDropAccepted={onDropAccepted} acceptedFiles={files} onFileRemove={handleFileRemove} {...dropzoneConfig} />

        {isSubmitting && (
          <div className="space-y-2 mt-4">
            <p className="text-sm font-medium text-primary text-center">
              Uploading... ({uploadProgress}%)
            </p>
            <Progress value={uploadProgress} className="h-2 w-full" />
          </div>
        )}

        {/* 💡 Simplified loading indicator 💡 */}
        {isSubmitting && (
          <div className="mt-4 text-center text-sm font-medium text-primary">
            Processing upload and saving data...
          </div>
        )}

        {/* Informational Text */}
        <p className="text-xs text-muted-foreground pt-1">
          Required fields are marked with a <span className="text-red-500">*</span>. File must be a single PDF, max 10MB.
        </p>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || files.length === 0 || !formData.branch || !formData.subject || !formData.fileName}
          className="w-full"
        >
          {isSubmitting
            ? 'Uploading and Saving...'
            : `Upload Notes (${files.length} file)`}
        </Button>
      </form>
    </div>
  );
}