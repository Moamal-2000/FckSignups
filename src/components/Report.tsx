import { useState } from "react";
import { Toast } from "../components/Toast";
import { useReport } from "../hooks/useReport";
import { useModal } from "../hooks/useModal";

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

      <ReportButton clicked={clicked} setClicked={setClicked} />
      {clicked && <ReportMenu />}
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
  return (
    <>
      <button
        onClick={() => setClicked(!clicked)}
        className="submit-tool-button report-button"
        data-sticky={clicked}
      >
        <svg
          style={{ display: "block" }}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </>
  );
}

function ReportMenu() {
  const { reportMode, setReportMode } = useReport();
  const { showModalWithID } = useModal();
  return (
    <>
      <ul className="report-menu">
        <li
          className="report-menu-item submit-tool-button"
          data-sticky={reportMode}
          onClick={() => setReportMode(!reportMode)}
        >
          REPORT AN ENTRY
        </li>
        <li
          className="report-menu-item submit-tool-button"
          onClick={() => showModalWithID("suggest-tool")}
        >
          SUGGEST A TOOL FOR US TO MAKE
        </li>
      </ul>
    </>
  );
}
