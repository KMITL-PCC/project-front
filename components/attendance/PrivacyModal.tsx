import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PrivacyModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-kmitl underline cursor-pointer">
          Privacy Policy
        </span>
      </DialogTrigger>
      
      <DialogContent className="max-w-87.5 rounded-[2.5rem] bg-white p-0 border-none shadow-2xl overflow-hidden gap-0">
        
        <DialogHeader className="p-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-center text-xl font-bold text-kmitl uppercase tracking-tight">
            PRIVACY POLICY
          </DialogTitle>
        </DialogHeader>

        <div className="px-8 py-6 max-h-[60vh] overflow-y-auto text-[13px] leading-relaxed text-gray-700 custom-scrollbar">
          <div className="space-y-6">
            <section>
              <h3 className="font-bold text-gray-900 mb-1">1. Personal Data Collected</h3>
              <p>The system may collect and process the following personal data:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Full name</li>
                <li>Student ID number</li>
                <li>Attendance records (date, time, and attendance status)</li>
                <li>LINE User ID or other information necessary for LINE system integration</li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-1">2. Purpose of Data Collection</h3>
              <p>The collected personal data will be used for the following purposes:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>To verify user identity for classroom attendance scanning</li>
                <li>To record and manage attendance information</li>
                <li>To display attendance history and related information via the LINE platform</li>
              </ul>
            </section>

            <section className="pb-4">
              <h3 className="font-bold text-gray-900 mb-1">3. LINE Application Integration</h3>
              <p>Users may add the system as a LINE friend in order to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>View attendance history</li>
                <li>Receive notifications regarding attendance status</li>
                <li>Conveniently access personal attendance-related information</li>
              </ul>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}