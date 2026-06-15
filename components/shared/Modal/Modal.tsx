import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  headerComponent?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  footerComponent?: React.ReactNode;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  headerComponent,
  footerComponent,
}: ModalProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange} modal={true}>
      <DialogContent className={cn("", className)}>
        {headerComponent}
        {
          !headerComponent && (
            <DialogHeader>
          {(title || description) && (
            <div>
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </div>
          )}
        </DialogHeader>
          )
        }
        
        <div className={cn("max-h-[90vh] overflow-scroll")}>{children}</div>
        {
          footerComponent && (
            <DialogFooter>  
              {footerComponent}
            </DialogFooter>
          )
        }
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
