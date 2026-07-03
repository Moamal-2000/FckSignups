import {
  createContext,
  FormEvent,
  ReactNode,
  useContext,
  useState,
} from "react";
import type { ModalConfig, TextField } from "./types";
import { fieldsMaker } from "./fieldsMaker";

type showModalFields = (
  modalID: string | undefined,
  populatedFields?: Record<string, string>,
) => void;

interface ModalController {
  showModalWithID: showModalFields;
}

const ReportContext = createContext<ModalController | undefined>(undefined);

export function useModal() {
  const context = useContext(ReportContext);

  if (!context) {
    throw new Error("useModal must be used inside a ModalProvider");
  }

  return context;
}

type ModalStatus = "idle" | "loading" | "success" | "failure";

function ModalRenderer({ modalConfig }: { modalConfig: ModalConfig }) {
  const { showModalWithID } = useModal();
  const [modalStatus, setModalStatus] = useState<ModalStatus>("idle");
  const modalInputFields = fieldsMaker(modalConfig);
  return (
    <div className="modal-overlay" onClick={() => showModalWithID(undefined)}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title modal-title-accent">
            {modalConfig.modalTitle}
          </h2>
          <button
            className="modal-close"
            onClick={() => handleClose(setModalStatus, showModalWithID)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {modalStatus === "idle" ? (
          <form
            onSubmit={(e) =>
              handleSubmit(e, setModalStatus, modalConfig.submitURL)
            }
            method="post"
            className="modal-form"
            id="modal-engine-form"
          >
            {modalInputFields}
            <input type="submit" className="modal-submit-btn" />
          </form>
        ) : modalStatus === "success" ? (
          <div className="modal-success">
            <div className="modal-success-icon">✓</div>
            <p className="modal-success-title">TOOL SUBMITTED</p>
            <p className="modal-success-sub">
              We'll review it and add it to the index shortly.
            </p>
            <button
              className="modal-submit-btn"
              onClick={() => handleClose(setModalStatus, showModalWithID)}
            >
              CLOSE
            </button>
          </div>
        ) : (
          <p className="modal-error">
            Encountered an error while submitting...
          </p>
        )}
      </div>
    </div>
  );
}

export function ModalProvider({
  children,
  modalConfigs,
}: {
  children: ReactNode;
  modalConfigs: ModalConfig[];
}) {
  const [requestedModalConfig, setRequestedModalConfig] = useState<
    ModalConfig | undefined
  >(undefined);

  function showModalWithID(
    modalID: string | undefined,
    populatedFields?: Record<string, string>,
  ) {
    const requestedModalConfig = modalConfigs.find(
      (modalConfig) => modalConfig.modalId === modalID,
    );

    // Debug statement
    if (requestedModalConfig === undefined && modalID !== undefined)
      console.warn(
        `Attempted to open a modal with id that doesn't exist. Modal_ID requested: ${modalID}`,
      );

    // PopulateFields
    if (requestedModalConfig !== undefined && populatedFields !== undefined) {
      for (const [name, value] of Object.entries(populatedFields)) {
        for (const page of requestedModalConfig.pages) {
          for (const field of page.fields) {
            if (field.name === name && field.type === "text")
              field.value = value;
          }
        }
      }
    }

    setRequestedModalConfig(requestedModalConfig);
  }

  return (
    <ReportContext.Provider value={{ showModalWithID }}>
      {children}
      {requestedModalConfig && (
        <ModalRenderer modalConfig={requestedModalConfig} />
      )}
    </ReportContext.Provider>
  );
}

async function handleSubmit(
  e: FormEvent,
  setModalStatus: (status: ModalStatus) => void,
  submitURL: string,
) {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);
  const formProps = Object.fromEntries(formData);

  setModalStatus("loading");

  const response = await fetch(submitURL, {
    method: "POST",
    body: JSON.stringify(formProps),
  });

  response.ok ? setModalStatus("success") : setModalStatus("failure");
}

function handleClose(
  setModalStatus: (modalStatus: ModalStatus) => void,
  showModalWithID: showModalFields,
) {
  setModalStatus("idle");
  showModalWithID(undefined);
}
