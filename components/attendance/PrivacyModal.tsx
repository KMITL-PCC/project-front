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
              <h3 className="font-bold text-gray-900 mb-1">
                1. Personal Data Collected
              </h3>
              <p>
                The system may collect and process the following personal data:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Full name</li>
                <li>Student ID number</li>
                <li>Attendance records (date, time, and attendance status)</li>
                <li>
                  Device and browser information used to access the system
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-1">
                2. Purpose of Data Collection
              </h3>
              <p>
                The collected personal data will be used for the following
                purposes:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  To verify user identity for classroom attendance scanning
                </li>
                <li>To record and manage attendance information</li>
                <li>
                  To display attendance history and related information via the
                  web application
                </li>
              </ul>
            </section>

            <section className="pb-4">
              <h3 className="font-bold text-gray-900 mb-1">
                3. Data Retention & Security
              </h3>
              <p>
                The system is committed to protecting your personal data by:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  Storing data only for the duration necessary for academic
                  purposes
                </li>
                <li>Restricting data access to authorized personnel only</li>
                <li>
                  Not disclosing personal data to any third parties without
                  consent
                </li>
              </ul>
            </section>

            <section className="pb-4">
              <h3 className="font-bold text-gray-900 mb-1">4. User Rights</h3>
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  Access and review your personal attendance records via the web
                  application
                </li>
                <li>Request correction of inaccurate data</li>
                <li>
                  Contact the system administrator for any data-related
                  inquiries
                </li>
              </ul>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
