"use client";

import { useState } from "react";
import { CircleAlertIcon, XIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export interface AlertGradientProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  type?: "success" | "error";
}

const ALERT_STYLES: Record<
  "success" | "error",
  {
    bgGradient: string;
    iconBg: string;
    iconColor: string;
    btnBg: string;
    closeHover: string;
  }
> = {
  success: {
    bgGradient: "from-teal-400/10",
    iconBg: "bg-teal-400/20",
    iconColor: "text-teal-400",
    btnBg: "bg-teal-400 hover:bg-teal-400/85",
    closeHover: "hover:bg-teal-400/20",
  },
  error: {
    bgGradient: "from-red-500/10",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-500",
    btnBg: "bg-red-500 hover:bg-red-500/85",
    closeHover: "hover:bg-red-500/20",
  },
};

const AlertGradient = ({
  title,
  description,
  actionText,
  onAction,
  type = "success",
}: AlertGradientProps) => {
  const [isClosed, setIsClosed] = useState(false);

  if (isClosed) return null;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClosed(true);
  };

  // Fix for the TS error in Version 1
  const transition = { type: "spring" as const, stiffness: 300, damping: 30 };
  const styles = ALERT_STYLES[type];

  // We force isExpanded to true so we get Version 1's exact expanded styling,
  // which naturally prevents description truncation and always shows the X button.
  const isExpanded = true;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-md">
      <motion.div
        layout
        transition={transition}
        className={`rounded-lg border-none shadow-md bg-background text-accent-foreground flex gap-2 justify-between bg-linear-to-b to-transparent to-80% select-none p-3 transition-colors duration-300 ${styles.bgGradient} ${isExpanded ? "items-start" : "items-center"}`}
      >
        <motion.div
          layout
          className={`p-2 shadow-sm rounded-full shrink-0 ${styles.iconBg}`}
        >
          <CircleAlertIcon size={16} className={styles.iconColor} />
        </motion.div>

        <motion.div
          layout
          transition={transition}
          className={`flex flex-1 gap-2 ${isExpanded ? "flex-col items-start" : "flex-row items-center justify-between overflow-hidden"}`}
        >
          <motion.div
            layout
            transition={transition}
            className={`flex gap-2 ${isExpanded ? "flex-col items-start gap-0.5" : "flex-row items-center"}`}
          >
            <motion.div layout="position" transition={transition}>
              <AlertTitle className={isExpanded ? "" : "shrink-0 mb-0"}>
                {title}
              </AlertTitle>
            </motion.div>
            <motion.div
              layout="position"
              transition={transition}
              className="min-w-0"
            >
              <AlertDescription className="text-accent-foreground/60">
                {description}
              </AlertDescription>
            </motion.div>
          </motion.div>

          {actionText && (
            <motion.div
              layout
              transition={transition}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                className={`w-fit text-white text-xs cursor-pointer shrink-0 ${styles.btnBg}`}
                onClick={onAction}
              >
                {actionText}
              </Button>
            </motion.div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.button
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className={`cursor-pointer shrink-0 p-1 rounded-full ${styles.closeHover}`}
              onClick={handleClose}
            >
              <XIcon className="size-4 text-accent-foreground/75" />
              <span className="sr-only">Close</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AlertGradient;