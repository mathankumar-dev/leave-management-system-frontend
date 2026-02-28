import { toast } from "sonner";

export const notify = {
  success: (title: string, description?: string) => 
    toast.success(title, { description }),
    
  error: (title: string, description?: string) => 
    toast.error(title, { description }),
    
  info: (title: string, description?: string) => 
    toast.info(title, { description }),

  // Custom Leave logic
  leaveAction: (status: string, name: string) => {
    const messages: Record<string, any> = {
      APPROVED: { type: toast.success, text: `Approved leave for ${name}` },
      REJECTED: { type: toast.error, text: `Rejected leave for ${name}` },
      MEETING_REQUIRED: { type: toast.info, text: `Discussion requested with ${name}` },
    };
    
    const action = messages[status];
    if (action) action.type(action.text);
  }
};