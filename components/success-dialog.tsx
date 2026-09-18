"use client";

import { CheckCircleIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function SuccessDialog({ open }: { open: boolean }) {
  return (
    <Dialog open={open}>
      <DialogContent
        className="gap-4 overflow-hidden p-10 data-open:zoom-in-95 data-closed:zoom-out-95 duration-300 sm:max-w-[400px] [&>button]:hidden flex flex-col items-center justify-center"
      >
        <div className="p-4 shadow-sm rounded-full shrink-0 bg-teal-400/20 mb-2">
          <CheckCircleIcon size={48} className="text-teal-400" />
        </div>

        <DialogHeader className="items-center gap-2 text-center">
          <DialogTitle className="text-2xl font-semibold">
            Email verified successfully
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Taking you to login...
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
