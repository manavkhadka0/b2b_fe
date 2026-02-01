"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MinimalTiptapEditor } from '@/components/minimal-tiptap';
import type { Content } from '@tiptap/react';
import { toast } from 'sonner';
import { applyToJob } from '@/services/jobs';

interface ApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobSlug: string;
  jobTitle: string;
  onSuccess?: () => void;
}

export const ApplyDialog: React.FC<ApplyDialogProps> = ({
  open,
  onOpenChange,
  jobSlug,
  jobTitle,
  onSuccess,
}) => {
  const [coverLetter, setCoverLetter] = useState<Content>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Check if cover letter is empty
    let isEmpty = false;
    if (!coverLetter) {
      isEmpty = true;
    } else if (typeof coverLetter === 'string') {
      // Remove HTML tags and check if there's actual content
      const textContent = coverLetter.replace(/<[^>]*>/g, '').trim();
      isEmpty = textContent === '';
    } else if (typeof coverLetter === 'object') {
      // For JSON content, check if it has meaningful content
      const jsonStr = JSON.stringify(coverLetter);
      isEmpty = jsonStr === '{}' || jsonStr === '[]' || jsonStr === 'null';
    }

    if (isEmpty) {
      toast.error('Please write a cover letter');
      return;
    }

    setIsSubmitting(true);
    try {
      await applyToJob(jobSlug, coverLetter);
      toast.success('Application submitted successfully!');
      setCoverLetter('');
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit application';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCoverLetter('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>
            Write your cover letter below. This will be sent along with your application.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Cover Letter
            </label>
            <MinimalTiptapEditor
              value={coverLetter}
              onChange={setCoverLetter}
              placeholder="Write your cover letter here..."
              output="html"
              className="min-h-[300px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
