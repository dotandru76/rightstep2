
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
    // Apply the update
    const success = await applyUpdate(updateInfo);
    if (success) {
      onUpdate();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && !updateInfo.mandatory && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Available</AlertDialogTitle>
          <AlertDialogDescription>
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
        <AlertDialogFooter>
          {!updateInfo.mandatory && (
            <AlertDialogCancel>Later</AlertDialogCancel>
          )}
          <AlertDialogAction onClick={handleUpdate}>
            Update Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateNotification;
