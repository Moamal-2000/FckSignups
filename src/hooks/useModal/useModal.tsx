import {
  createContext,
  FormEvent,
  ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import { fieldsMaker } from "./fieldsMaker";
import type { ModalConfig } from "./types";

type showModalFields = (
  modalID: string | undefined,
  populatedFields?: Record<string, string>,
) => void;
type ModalFieldValues = Record<string, string>;

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

function ModalRenderer({
  modalConfig,
  initialFieldValues,
  saveFieldValues,
}: {
  modalConfig: ModalConfig;
  initialFieldValues: ModalFieldValues;
  saveFieldValues: (modalId: string, values: ModalFieldValues) => void;
}) {
  const { showModalWithID } = useModal();
  const [modalStatus, setModalStatus] = useState<ModalStatus>("idle");
  const [modalFieldValues, setModalFieldValues] =
    useState<ModalFieldValues>(initialFieldValues);

  const modalInputFields = fieldsMaker(
    modalConfig,
    modalFieldValues,
    (_modalId, fieldName, value) => {
      setModalFieldValues((current) => ({
        ...current,
        [fieldName]: value,
      }));
    },
  );

  function closeModal() {
    saveFieldValues(modalConfig.modalId, modalFieldValues);
    showModalWithID(undefined);
    setModalStatus("idle");
  }

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title modal-title-accent">
            {modalConfig.modalTitle}
          </h2>
          <button
            className="modal-close"
            onClick={closeModal}
            aria-label={`Close ${modalConfig.modalId.replace("-", " ")} modal`}
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
            <button className="modal-submit-btn" onClick={closeModal}>
              CLOSE
            </button>
          </div>
        ) : modalStatus === "failure" ? (
          <p className="modal-error">
            Encountered an error while submitting...
          </p>
        ) : (
          <p>Submitting...</p>
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
  const modalFieldValuesRef = useRef<Record<string, ModalFieldValues>>({});

  function showModalWithID(
    modalID: string | undefined,
    populatedFields?: Record<string, string>,
  ) {
    const requestedModalConfig = modalConfigs.find(
      (modalConfig) => modalConfig.modalId === modalID,
    );

    if (requestedModalConfig === undefined && modalID !== undefined)
      console.warn(
        `Attempted to open a modal with id that doesn't exist. Modal_ID requested: ${modalID}`,
      );

    if (
      modalID !== undefined &&
      requestedModalConfig !== undefined &&
      populatedFields !== undefined
    ) {
      modalFieldValuesRef.current[modalID] = {
        ...(modalFieldValuesRef.current[modalID] ?? {}),
        ...populatedFields,
      };
    }

    setRequestedModalConfig(requestedModalConfig);
  }

  function saveFieldValues(modalId: string, values: ModalFieldValues) {
    modalFieldValuesRef.current[modalId] = values;
  }

  const activeFieldValues = requestedModalConfig
    ? (modalFieldValuesRef.current[requestedModalConfig.modalId] ?? {})
    : {};

  return (
    <ReportContext.Provider value={{ showModalWithID }}>
      {children}
      {requestedModalConfig && (
        <ModalRenderer
          modalConfig={requestedModalConfig}
          initialFieldValues={activeFieldValues}
          saveFieldValues={saveFieldValues}
        />
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
