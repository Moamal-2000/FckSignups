import { useState } from "react";
import { Toast } from "../components/Toast";
import { ChatIcon } from "../constants/icons";
import { useModal } from "../hooks/useModal";
import { useReport } from "../hooks/useReport";

export function Report() {
  const { reportMode, setReportMode } = useReport();
  const [clicked, setClicked] = useState(false);
  return (
    <>
      {reportMode && (
        <Toast
          innerText="Select an entry to report"
          onExit={() => setReportMode(false)}
        />
      )}

      <div className="report-wrapper">
        <ReportButton clicked={clicked} setClicked={setClicked} />
        {clicked && <ReportMenu />}
      </div>
    </>
  );
}

function ReportButton({
  clicked,
  setClicked,
}: {
  clicked: boolean;
  setClicked: (clickedStatus: boolean) => void;
}) {
  const label = "Report or suggest a tool";

  return (
    <>
      <button
        onClick={() => setClicked(!clicked)}
        className="submit-tool-button report-button"
        aria-label={label}
        title={label}
        aria-haspopup="menu"
        aria-expanded={clicked}
        data-sticky={clicked}
      >
        <ChatIcon />
      </button>
    </>
  );
}

function ReportMenu() {
  const { reportMode, setReportMode } = useReport();
  const { showModalWithID } = useModal();
  return (
    <>
      <ul className="report-menu" role="menu">
        <li role="none">
          <button
            type="button"
            role="menuitem"
            className="report-menu-item submit-tool-button"
            data-sticky={reportMode}
            onClick={() => setReportMode(!reportMode)}
          >
            REPORT AN ENTRY
          </button>
        </li>
        <li role="none">
          <button
            type="button"
            role="menuitem"
            className="report-menu-item submit-tool-button"
            onClick={() => showModalWithID("suggest-tool")}
          >
            SUGGEST A TOOL FOR US TO MAKE
          </button>
        </li>
      </ul>
    </>
  );
}
