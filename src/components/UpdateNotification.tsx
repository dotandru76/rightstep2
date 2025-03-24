
import React from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { applyUpdate } from "@/services/UpdateService";

interface UpdateNotificationProps {
  open: boolean;
  updateInfo: {
    version: string;
    buildNumber: number;
    mandatory: boolean;
    releaseNotes?: string;
    updateUrl: string;
  };
  onClose: () => void;
  onUpdate: () => void;
}

const UpdateNotification = ({
  open,
  updateInfo,
  onClose,
  onUpdate
}: UpdateNotificationProps) => {
  const handleUpdate = async () => {
    try {
      // Apply the update
      const success = await applyUpdate(updateInfo);
      if (success) {
        onUpdate();
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <AlertDialog 
      open={open} 
      onOpenChange={(open) => !open && !updateInfo.mandatory && onClose()}
    >
      <AlertDialogContent className="max-w-[90%] w-[320px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">Update Available</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Version {updateInfo.version} is now available. 
            {updateInfo.releaseNotes && (
              <>
                <br /><br />
                <strong>What's new:</strong><br />
                {updateInfo.releaseNotes}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          {!updateInfo.mandatory && (
            <AlertDialogCancel className="mt-0">Later</AlertDialogCancel>
          )}
          <AlertDialogAction onClick={handleUpdate} className="w-full sm:w-auto">
            Update Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateNotification;
